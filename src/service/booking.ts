import bookingRepository from "../repository/booking";
import CustomError from "../util/customError";
import paymentService from "./payment";

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

  // Add a delay of 3 seconds to simulate real-world processing time
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    eventId,
    reservedSeatIds: reservedSeats,
  };
};

const confirmBooking = async (
  userId: number,
  eventId: number,
  reservedSeatIds: number[],
  cardDetails: {
    cardNumber: string;
    cvv: string;
    expiry: string;
    cardholder: string;
  },
) => {
  const { status, total } =
    await bookingRepository.verifyReservationAndCalculateTotal(
      userId,
      eventId,
      reservedSeatIds,
    );

  if (status === "invalid") {
    throw new CustomError(
      "Some or all reserved seats are no longer valid for booking",
      409,
    );
  }

  // Mock payment process
  await paymentService.processPayment(cardDetails, total);

  const bookingConfirmation = await bookingRepository.confirmBooking(
    userId,
    eventId,
    reservedSeatIds,
    total,
  );

  return bookingConfirmation;
};

export default { reserveSeats, confirmBooking };
