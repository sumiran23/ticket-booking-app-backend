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

const getEventById = async (id: number): Promise<Event | null> => {
  const query = `
    WITH seat_details AS (
        SELECT 
            s.event_id,
            s.id AS seat_id,
            s.seat_number,
            s.type AS seat_type,
            s.price,
            ts.status AS db_status,
            ts.held_until,
            CASE
                WHEN ts.status = 'available' THEN 'AVAILABLE'
                WHEN ts.status = 'booked' THEN 'BOOKED'
                WHEN ts.status = 'reserved' AND NOW() > ts.held_until THEN 'AVAILABLE'
                WHEN ts.status = 'reserved' AND NOW() <= ts.held_until THEN 'RESERVED'
                ELSE 'AVAILABLE'
            END AS current_status,
            CASE
                WHEN ts.status = 'reserved' AND NOW() <= ts.held_until THEN
                    EXTRACT(EPOCH FROM (ts.held_until - NOW()))
                ELSE NULL
            END AS seconds_remaining
        FROM seats s
        JOIN ticketstatus ts ON s.id = ts.seat_id AND s.event_id = ts.event_id
        WHERE s.event_id = $1
    )
    SELECT 
        e.id,
        e.title,
        e.description,
        e.thumbnail,
        e.venue,
        e.eventdatetime,
        
        -- Total counts
        (SELECT COUNT(*) FROM seat_details WHERE event_id = e.id) AS total_seats,
        (SELECT COUNT(*) FROM seat_details WHERE event_id = e.id AND current_status = 'AVAILABLE') AS available_seats,
        (SELECT COUNT(*) FROM seat_details WHERE event_id = e.id AND current_status = 'RESERVED') AS reserved_seats,
        (SELECT COUNT(*) FROM seat_details WHERE event_id = e.id AND current_status = 'BOOKED') AS booked_seats,
        
        -- Seats as JSON array
        (
            SELECT json_agg(
                json_build_object(
                    'seat_id', seat_id,
                    'seat_number', seat_number,
                    'seat_type', seat_type,
                    'price', price,
                    'status', current_status,
                    'seconds_remaining', seconds_remaining
                ) ORDER BY seat_id
            )
            FROM seat_details
            WHERE event_id = e.id
        ) AS seats

    FROM events e
    WHERE e.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export default { getAllEvents, getEventById };
