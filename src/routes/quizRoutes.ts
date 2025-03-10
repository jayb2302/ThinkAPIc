import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import {
  getQuizzes,
  getQuizById,
  getQuizzesByTopic,
  getUserQuizAttempts,
  getUserQuizProgress,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
} from "../controllers/quizController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: API endpoints for quizzes
 */

// ------------------------------------------
// 🔓 Public Routes
// ------------------------------------------
/**
 * @swagger
 * /quizzes:
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
 *                 $ref: "#/components/schemas/QuizResponse"
 */
router.get("/", getQuizzes);
/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67a1fb6a19841151773d89b1"
 *         description: The ID of the quiz to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuizResponse"
 *       404:
 *         description: Quiz not found
 */
router.get("/:id", getQuizById);

/**
 * @swagger
 * /quizzes/topic/{topicId}:
 *   get:
 *     summary: Get all quizzes for a specific topic
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *           example: "679b42460a99919e3b623a76"
 *         description: The ID of the topic to retrieve quizzes for
 *     responses:
 *       200:
 *         description: Successfully retrieved quizzes for the topic
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/QuizResponse"
 *       404:
 *         description: No quizzes found for this topic
 */
router.get("/topic/:topicId", getQuizzesByTopic);

//--------------------------------------------
// 🔏 Authenticated Routes (User-Only)
//--------------------------------------------
/**
 * @swagger
 * /quizzes/{id}/attempt:
 *   post:
 *     summary: Submit a quiz attempt for a user
 *     description: |
 *       **How to try this API:**
 *       1. First, fetch available quizzes using [GET /quizzes](#/Quizzes/get_api_quizzes).
 *       2. Copy a valid `quizId` from the response.
 *       3. Use that `quizId` in the `id` parameter here.
 *       4. Provide a valid `courseId` in the request body.
 *       5. Provide the `selectedOptionOrder` (1-based index) for the selected answer.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67a1fb6a19841151773d89b1"  
 *         description: The ID of the quiz being attempted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QuizAttemptRequest"
 *     responses:
 *       201:
 *         description: Successfully logged the quiz attempt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuizAttemptResponse"
 *       400:
 *         description: Invalid option selected
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       404:
 *         description: Quiz not found or topic is missing
 *       500:
 *         description: Server error
 */
router.post("/:id/attempt", authenticateUser, attemptQuiz);

/**
 * @swagger
 * /quizzes/attempts/{userId}:
 *   get:
 *     summary: Get quiz attempts by user ID
 *     tags: [Quizzes]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "67c4d034e1968c13a337c8c3"
 *         description: The ID of the user to get quiz attempts for
 *     responses:
 *       200:
 *         description: Successfully retrieved all quiz attempts for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserQuizAttemptsResponse"
 *       404:
 *         description: No quiz attempts found for this user.
 */
router.get("/attempts/:userId", authenticateUser, getUserQuizAttempts);

/**
 * @swagger
 * /quizzes/progress/{userId}/{courseId}:
 *   get:
 *     summary: Get quiz progress by user and course IDs
 *     tags: [Quizzes]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "67c4d034e1968c13a337c8c3"
 *         description: The ID of the user to get quiz progress for
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           example: "679b42460a99919e3b623a74"
 *         description: The ID of the course to get quiz progress for
 *     responses:
 *       200:
 *         description: Successfully retrieved user quiz progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserQuizProgressResponse"
 *       404:
 *         description: User or Course not found
 */
router.get("/progress/:userId/:courseId", authenticateUser, getUserQuizProgress );

//--------------------------------------------
// 🔐 Admin Routes
//--------------------------------------------
/**
 * @swagger
 * /quizzes:
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
 *             $ref: "#/components/schemas/QuizRequest"
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/QuizResponse"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized access
 */
router.post("/", authenticateUser, authorizeAdmin, createQuiz);

/**
 * @swagger
 * /quizzes/{id}:
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
 *             $ref: "#/components/schemas/QuizRequest"
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuizResponse"
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
 * /quizzes/{id}:
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
