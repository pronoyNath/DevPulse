import type { Request, Response } from "express";
import { authService } from "./auth.services";
import config from "../../config";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refresh_token } = result;

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (err: any) {
    // console.error("Error inserting user data:", err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const result = await authService.generateRefreshToken(refreshToken);
    if (!result) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const authController = {
  loginUser,
  refreshToken,
};
