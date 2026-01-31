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

export default { reserveSeats };
