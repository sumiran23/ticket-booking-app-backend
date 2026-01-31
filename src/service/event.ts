import eventRepository from "../repository/event";
import { Event } from "../types/event";

const getAllEvents = async (): Promise<Event[]> => {
  const events = await eventRepository.getAllEvents();
  return events;
};

export default { getAllEvents };
