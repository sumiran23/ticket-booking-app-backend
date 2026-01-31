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
    WITH seat_status AS (
    SELECT 
        s.id AS seat_id,
        s.seat_number,
        s.type AS seat_type,
        s.price,
        b.status AS booking_status,
        b.held_until,
        CASE
            WHEN b.id IS NULL THEN 'AVAILABLE'
            WHEN b.status = 'booked' THEN 'BOOKED'
            WHEN b.status = 'reserved' AND NOW() > (b.held_until ) THEN 'AVAILABLE'
            WHEN b.status = 'reserved' AND NOW() <= (b.held_until) THEN 'RESERVED'
            ELSE 'AVAILABLE'
        END AS current_status
    FROM seats s
    LEFT JOIN bookings b ON s.id = b.seat_id
    WHERE s.event_id = $1
    )
    SELECT 
        e.*,
        json_agg(
            json_build_object(
                'seat_id', ss.seat_id,
                'seat_number', ss.seat_number,
                'seat_type', ss.seat_type,
                'price', ss.price,
                'status', ss.current_status
            ) ORDER BY ss.seat_id
        ) AS seats
    FROM events e
    CROSS JOIN seat_status ss
    WHERE e.id = $1
    GROUP BY e.id;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export default { getAllEvents, getEventById };
