import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { ISignup } from "./auth.interface";
import { StatusCodes } from "http-status-codes";

const signupUserIntoDB = async (payload: ISignup) => {
  const { name, email, password, role = "contributor" } = payload;

  if (!name || !email || !password) {
    throw Object.assign(new Error("name, email, and password are required"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (!["contributor", "maintainer"].includes(role)) {
    throw Object.assign(new Error("role must be contributor or maintainer"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    throw Object.assign(new Error("Email already registered"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

export const authService = {
  signupUserIntoDB,
};
