import type { Request, Response } from "express";
import { userService } from "./user.services";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    // console.error("Error inserting user data:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getUserByIdFromDB(id as string);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUserByIdInDB(id as string, req.body);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error updating user data:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserByIdFromDB(id as string);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error deleting user data:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
