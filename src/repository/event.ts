import pool from "../database/db";
import { Event } from "../types/event";

const getAllEvents = async (): Promise<Event[]> => {
  const query = `
    SELECT * FROM events
    ORDER BY eventdatetime ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export default { getAllEvents };
