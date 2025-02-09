import express from "express";
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } from "../controllers/quizController";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Public Routes
router.get("/", getQuizzes);
router.get("/:id", getQuizById);

// Admin Routes
router.post("/", authenticateUser, authorizeAdmin, createQuiz);
router.put("/:id", authenticateUser, authorizeAdmin, updateQuiz);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteQuiz);

export default router;