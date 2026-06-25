import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { ILogin } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: ILogin) => {
  const { email, password } = payload;

  // check if user exists in DB
  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userData.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  // compare password with hash password in DB
  const matchPassword = await bcrypt.compare(
    password,
    userData.rows[0].password,
  );

  if (!matchPassword) {
    throw new Error("Invalid email or password");
  }

  //   generate a JWT token
  const jwtpayload = {
    id: userData.rows[0].id,
    name: userData.rows[0].name,
    email: userData.rows[0].email,
    role: userData.rows[0].role,
    is_active: userData.rows[0].is_active,
  };

  const accessToken = jwt.sign(jwtpayload, config.secretKey as string, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"] & {},
  });

  const refreshToken = jwt.sign(
    jwtpayload,
    config.refreshTokenSecretKey as string,
    {
      expiresIn:
        config.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"] & {},
    },
  );

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

const generateRefreshToken = async (token: string) => {
  try {
    if (!token) {
      throw new Error("Unauthorized");
    }

    // decoded token
    const decodedToken = jwt.verify(
      token as string,
      config.refreshTokenSecretKey as string,
    ) as JwtPayload;

    const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
      decodedToken.email,
    ]);

    if (userData.rows.length === 0) {
      throw new Error("user not found");
    }

    const user = userData.rows[0];

    if (!user?.is_active) {
      throw new Error("User is not active");
    }

    //   generate a JWT token
    const jwtpayload = {
      id: userData.rows[0].id,
      name: userData.rows[0].name,
      email: userData.rows[0].email,
      role: userData.rows[0].role,
      is_active: userData.rows[0].is_active,
    };

    const accessToken = jwt.sign(jwtpayload, config.refreshTokenSecretKey as string, {
      expiresIn: config.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"] & {},
    });

    return {
      access_token: accessToken,
    };
  } catch (error) {
    return error;
  }
};

export const authService = {
  generateRefreshToken,
  loginUserIntoDB,
};
