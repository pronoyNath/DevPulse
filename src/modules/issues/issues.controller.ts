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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query as {
      sort?: string;
      type?: string;
      status?: string;
    };
    const result = await issuesService.getAllIssues({ sort, type, status });
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Issues retrived successfully",
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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"] ?? "");
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid issue id",
      });
    }
    const result = await issuesService.getSingleIssue(id);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue retrived successfully",
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
  getAllIssues,
  getSingleIssue,
};
