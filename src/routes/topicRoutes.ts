import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import { getTopics, getTopicById, createTopic, updateTopic, deleteTopic } from "../controllers/topicController";

const router = express.Router();

// Public routes
router.get("/", getTopics);
router.get("/:id", getTopicById);

// Protected routes
router.post("/", authenticateUser, authorizeAdmin, createTopic);
router.put("/:id", authenticateUser, authorizeAdmin, updateTopic);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteTopic);

export default router;
