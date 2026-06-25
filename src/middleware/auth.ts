import type { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { UserRole } from "../types";
import { StatusCodes } from "http-status-codes";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: no token provided",
        });
      }

      const decodedToken = jwt.verify(
        token as string,
        config.secretKey as string,
      ) as JwtPayload & { id: number; name: string; role: string };

      if (roles.length > 0 && !roles.includes(decodedToken.role as UserRole)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Forbidden: insufficient permissions",
        });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired token",
        errors: error,
      });
    }
  };
};

export default auth;
