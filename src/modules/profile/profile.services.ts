import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const createProfileIntoDB = async (payload: IProfile) => {
  console.log(payload)
  const { user_id, bio, address, phone, gender } = payload;

  // checking if user exists or not
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [user_id]);

  if (user.rowCount === 0) {
    throw new Error("User not found");
  }
 
  // create profile for the user
  const result = await pool.query(
    "INSERT INTO profiles (user_id, bio, address, phone, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [user_id, bio, address, phone, gender]
  );


  return result;
};

export const profileServices = {
  createProfileIntoDB,
};