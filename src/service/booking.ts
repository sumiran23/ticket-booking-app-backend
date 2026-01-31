import bookingRepository from "../repository/booking";
import CustomError from "../util/customError";

const reserveSeats = async (
  userId: number,
  eventId: number,
  seatIds: number[],
) => {
  const reservedSeats = await bookingRepository.reserveSeats(
    userId,
    eventId,
    seatIds,
  );

  if (reservedSeats.length === 0) {
    throw new CustomError(
      "Some or all selected seats are no longer available",
      409,
    );
  }

  return {
    eventId,
    reservedSeatIds: reservedSeats,
  };
};

export default { reserveSeats };
