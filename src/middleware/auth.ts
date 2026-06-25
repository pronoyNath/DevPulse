import type { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../db";
import type { UserRole } from "../types";
import sendResponse from "../utility/sendResponse";


const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // decoded token
      const decodedToken = jwt.verify(
        token as string,
        config.secretKey as string,
      ) as JwtPayload;

      const userData = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [decodedToken.email],
      );

      if (userData.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "user not found",
        });
      }

      const user = userData.rows[0];

      if (!user?.is_active) {
        return res.status(403).json({
          success: false,
          message: "User is not active",
        });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! This user does not have the required role to access this resource",
        });
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid token",
        error: error,
      });
    }
  };
};

export default auth;
