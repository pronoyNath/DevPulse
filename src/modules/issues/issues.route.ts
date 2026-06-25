import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.post("/", auth("contributor", "maintainer"), issuesController.createIssue);

export const issuesRoute = router;
