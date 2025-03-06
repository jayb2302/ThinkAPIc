import express from "express";
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } from "../controllers/quizController";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management endpoints
 */

// Public Routes
/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: Successfully retrieved all quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Quiz"
 */
router.get("/", getQuizzes);
/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quiz to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Quiz"
 *       404:
 *         description: Quiz not found
 */
router.get("/:id", getQuizById);

// Admin Routes
/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Quiz"
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized access
*/
router.post("/", authenticateUser, authorizeAdmin, createQuiz);
/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update a quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quiz to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Quiz"
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Quiz not found
 */
router.put("/:id", authenticateUser, authorizeAdmin, updateQuiz);
/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quiz to delete
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Quiz not found
 */
router.delete("/:id", authenticateUser, authorizeAdmin, deleteQuiz);

export default router;