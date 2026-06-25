import type { Request, Response } from "express";
import { issuesService } from "./issues.services";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req.user!.id;
    const result = await issuesService.createIssue(req.body, reporterId);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Issue created successfully",
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

export const issuesController = {
  createIssue,
};
