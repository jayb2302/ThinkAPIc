import express from "express";
import { getTopics, getTopicById, createTopic, updateTopic, deleteTopic } from "../controllers/topicController";

const router = express.Router();

// Use controllers
router.get("/", getTopics);
router.get("/:id", getTopicById);
router.post("/", createTopic);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

export default router;
