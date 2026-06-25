import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    errors: err.message,
  });
};

export default globalErrorHandler;
