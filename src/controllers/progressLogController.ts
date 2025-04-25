import { RequestHandler } from "express";
import ProgressLog from "../models/ProgressLog";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// Get all progress logs
export const getProgressLogs: RequestHandler = async (req: AuthenticatedRequest, res) => {
    try {
        const logs = await ProgressLog.find().populate("user").populate("course");
        res.status(200).json(logs);
    } catch (error) {
        console.error("❌ Failed to fetch progress logs:", error);
        res.status(500).json({ error: "Failed to fetch progress logs" });
    }
};

// Get progress log by user
export const getUserProgress: RequestHandler = async (req: AuthenticatedRequest, res) => {
    try {
        const { userId } = req.params;
        const logs = await ProgressLog.find({ user: userId }).populate("course");
        res.status(200).json(logs);
    } catch (error) {
        console.error("❌ Failed to fetch user progress:", error);
        res.status(500).json({ error: "Failed to fetch user progress" });
    }
};

// Add a new progress log
export const addProgressLog: RequestHandler = async (req: AuthenticatedRequest, res) => {
    try {
        const { user, course, activityType, activityTable, activityId } = req.body;

        const newLog = await ProgressLog.create({
            user,
            course,
            activityType,
            activityTable,
            activityId,
        });

        res.status(201).json(newLog);
    } catch (error) {
        console.error("❌ Failed to log progress:", error);
        res.status(500).json({ error: "Failed to log progress" });
    }
};