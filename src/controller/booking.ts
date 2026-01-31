import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/customRequest";
import bookingService from "../service/booking";

export const reserveSeats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventId, seatIds } = req.body;
    const userId = (req as CustomRequest).user.userId;
    const reservation = await bookingService.reserveSeats(
      userId,
      eventId,
      seatIds,
    );

    res.status(200).json({
      success: true,
      message: "Reservation done successfully",
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const confirmBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventId, reservedSeatIds, cardDetails } = req.body;
    const userId = (req as CustomRequest).user.userId;
    const booking = await bookingService.confirmBooking(
      userId,
      eventId,
      reservedSeatIds,
      cardDetails,
    );

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
