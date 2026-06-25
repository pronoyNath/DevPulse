import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.post("/", auth("contributor", "maintainer"), issuesController.createIssue);
router.patch("/:id", auth("contributor", "maintainer"), issuesController.updateIssue);

export const issuesRoute = router;
