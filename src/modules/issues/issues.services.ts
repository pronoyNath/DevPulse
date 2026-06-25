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

const getAllIssues = async (query: { sort?: string; type?: string; status?: string }) => {
  const { sort = "newest", type, status } = query;
  const order = sort === "oldest" ? "ASC" : "DESC";

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramCount = 0;

  if (type) {
    paramCount++;
    conditions.push(`type = $${paramCount}`);
    params.push(type);
  }

  if (status) {
    paramCount++;
    conditions.push(`status = $${paramCount}`);
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const issuesResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues ${whereClause} ORDER BY created_at ${order}`,
    params,
  );

  const issues = issuesResult.rows;
  if (issues.length === 0) return [];

  // batch fetch reporters without JOIN
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id as number))];
  const reportersResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = ANY($1::int[])",
    [reporterIds],
  );

  const reporterMap = new Map<number, { id: number; name: string; role: string }>();
  for (const r of reportersResult.rows) {
    reporterMap.set(r.id as number, r);
  }

  return issues.map((issue) => {
    const { reporter_id, ...rest } = issue;
    return { ...rest, reporter: reporterMap.get(reporter_id as number) ?? null };
  });
};

const getSingleIssue = async (id: number) => {
  const issueResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues WHERE id = $1`,
    [id],
  );

  if (issueResult.rows.length === 0) {
    throw Object.assign(new Error("Issue not found"), {
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [issue.reporter_id],
  );

  const { reporter_id, ...rest } = issue;
  return { ...rest, reporter: reporterResult.rows[0] ?? null };
};

export const issuesService = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};
