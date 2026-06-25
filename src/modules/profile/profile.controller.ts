import type { Request, Response } from "express";
import { profileServices } from "./profile.services";
    
const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileServices.createProfileIntoDB(req.body);

    return res.status(200).json({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error creating profile:", err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const profileController = {
  createProfile,
};
