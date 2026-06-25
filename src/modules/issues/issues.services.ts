import { pool } from "../../db";
import type { ICreateIssue } from "./issues.interface";
import { StatusCodes } from "http-status-codes";

const createIssue = async (payload: ICreateIssue, reporterId: number) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw Object.assign(new Error("title, description, and type are required"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (title.length > 150) {
    throw Object.assign(new Error("title must be 150 characters or less"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (description.length < 20) {
    throw Object.assign(new Error("description must be at least 20 characters"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (!["bug", "feature_request"].includes(type)) {
    throw Object.assign(new Error("type must be bug or feature_request"), {
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

export const issuesService = {
  createIssue,
};
