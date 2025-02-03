import express from "express";
import {
    getProgressLogs,
    getUserProgress,
    addProgressLog,
} from "../controllers/progressLogController";

const router = express.Router();

// Public routes (No authentication required)
router.get("/", getProgressLogs);
router.get("/:userId", getUserProgress);
router.post("/", addProgressLog);

export default router;