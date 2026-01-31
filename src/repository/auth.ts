import pool from "../database/db";
import { User } from "../types/user";

const findByEmail = async (email: string): Promise<User | null> => {
  const query = `
    SELECT 
      id,
      email,
      password
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async (
  email: string,
  passwordHash: string,
): Promise<User> => {
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email
  `;

  const result = await pool.query(query, [email, passwordHash]);
  return result.rows[0];
};

export default { findByEmail, createUser };
