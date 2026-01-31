import pool from "../database/db";

const reserveSeats = async (
  userId: number,
  eventId: number,
  seatIds: number[],
): Promise<number[]> => {
  /* 
    Logic to avoid double booking/reservation:
    1. Start a transaction.
    2. Attempt to update the status of the requested seats to 'reserved' only if they are currently 'available'.
       (This is an atomic update operation where the postgres database automatically locks the rows so that other transactions need to wait
       on the updated data.)
    3. If the number of rows updated is less than the number of requested seats, it means some seats were not available.
       In this case, rollback the transaction and return an empty array.
    4. If all seats were successfully reserved, commit the transaction and return the list of reserved seat IDs.
  */

  await pool.query("BEGIN");

  try {
    const result = await pool.query(
      `UPDATE ticketstatus
       SET status = 'reserved',
           user_id = $1,
           held_until = NOW() + INTERVAL '10 minutes'
       WHERE seat_id = ANY($2::int[])
         AND event_id = $3
         AND status = 'available'
       RETURNING id, seat_id`,
      [userId, seatIds, eventId],
    );

    if (result.rows.length !== seatIds.length) {
      await pool.query("ROLLBACK");
      return [];
    }

    await pool.query("COMMIT");

    return seatIds;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

const verifyReservationAndCalculateTotal = async (
  userId: number,
  eventId: number,
  reservedSeatIds: number[],
): Promise<{ status: string; total: number }> => {
  const reservationVerification = await pool.query(
    `SELECT 
         ts.id,
         ts.seat_id,
         ts.user_id,
         ts.status,
         ts.held_until,
         s.price,
         s.seat_number
       FROM ticketstatus ts
       JOIN seats s ON ts.seat_id = s.id
       WHERE ts.seat_id = ANY($1::int[])
         AND ts.event_id = $2
         AND ts.user_id = $3
         AND ts.status = 'reserved'
         AND ts.held_until > NOW()`,
    [reservedSeatIds, eventId, userId],
  );

  // If the reservation status of any of the ticket has changed, return false
  if (reservationVerification.rows.length !== reservedSeatIds.length) {
    return {
      status: "invalid",
      total: 0,
    };
  }

  const totalPrice = reservationVerification.rows.reduce(
    (sum, row) => sum + parseFloat(row.price),
    0,
  );

  return {
    status: "valid",
    total: totalPrice,
  };
};

const confirmBooking = async (
  userId: number,
  eventId: number,
  reservedSeatIds: number[],
  totalPrice: number,
): Promise<any> => {
  try {
    await pool.query("BEGIN");

    await pool.query(
      `UPDATE ticketstatus
       SET status = 'booked',
           held_until = NULL
       WHERE seat_id = ANY($1::int[])
         AND event_id = $2
         AND user_id = $3
         AND status = 'reserved'
         AND held_until > NOW()
       RETURNING id, seat_id`,
      [reservedSeatIds, eventId, userId],
    );

    const confirmationResult = await pool.query(
      `INSERT INTO booking_confirmations (event_id, user_id, total_price)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [eventId, userId, totalPrice],
    );

    const bookingConfirmation = confirmationResult.rows[0];

    await pool.query(
      `INSERT INTO booking_confirmation_seats (booking_confirmation_id, seat_id)
       SELECT $1, seat_id
       FROM unnest($2::int[]) AS seat_id`,
      [bookingConfirmation.id, reservedSeatIds],
    );

    await pool.query("COMMIT");

    return { bookingConfirmation };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};
export default {
  reserveSeats,
  verifyReservationAndCalculateTotal,
  confirmBooking,
};
