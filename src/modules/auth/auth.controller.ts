import type { Request, Response } from "express";
import { authService } from "./auth.services";
import { StatusCodes } from "http-status-codes";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUserIntoDB(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export const authController = {
  signup,
};
