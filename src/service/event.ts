import eventRepository from "../repository/event";
import { Event } from "../types/event";
import CustomError from "../util/customError";

const getAllEvents = async (): Promise<Event[]> => {
  const events = await eventRepository.getAllEvents();
  return events;
};

const getEventById = async (id: number): Promise<Event | null> => {
  const event = await eventRepository.getEventById(id);

  if (!event) {
    throw new CustomError("Event not found", 404);
  }

  return event;
};

export default { getAllEvents, getEventById };
