import { Request, Response, NextFunction } from "express";
import eventService from "../service/event";

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({
      success: true,
      data: events,
      message: "Events fetched successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(Number(id));
    res.status(200).json({
      success: true,
      data: event,
      message: "Events fetched successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
