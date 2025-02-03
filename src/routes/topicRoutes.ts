import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { getTopics, getTopicById, createTopic, updateTopic, deleteTopic } from "../controllers/topicController";

const router = express.Router();

// Public routes
router.get("/", getTopics);
router.get("/:id", getTopicById);

// Protected routes
router.post("/", createTopic);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

export default router;
