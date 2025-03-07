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
router.get("/topic/:topicId", getQuizzesByTopic);

// Authenticated Routes
/**
 * @swagger
 * /api/quizzes/{id}/attempt:
 *   post:
 *     summary: Submit a quiz attempt for a user
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quiz being attempted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user who is attempting the quiz
 *                 example: "679ffd9c76e8bc94e67258e4"  # Correct example userId
 *               quizId:
 *                 type: string
 *                 description: The ID of the quiz being attempted
 *                 example: "67c99db4d704ccfd8c43657d"  # Correct example quizId
 *               selectedOptionOrder:
 *                 type: number
 *                 description: The order of the selected answer option
 *                 example: 3  # Correct example selectedOptionOrder
 *               courseId:
 *                 type: string
 *                 description: The ID of the course related to the quiz
 *                 example: "679b42460a99919e3b623a74"  # Correct example courseId
 *     responses:
 *       201:
 *         description: Successfully logged the quiz attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "Quiz attempt logged"
 *                 isCorrect:
 *                   type: boolean
 *                   description: Whether the answer was correct
 *                   example: true
 *                 topicId:
 *                   type: string
 *                   description: The ID of the associated topic
 *                   example: "679b42460a99919e3b623a76"
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
 * /api/quizzes/attempts/{userId}:
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
 *         description: The ID of the user to get quiz attempts for
 *     responses:
 *       200:
 *         description: Successfully retrieved user quiz attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/QuizAttempt"
 *       404:
 *         description: No quiz attempts found for this user.
 */
router.get("/attempts/:userId", authenticateUser, getUserQuizAttempts);
/**
 * @swagger
 * /api/quizzes/progress/{userId}/{courseId}:
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
 *         description: The ID of the user to get quiz progress for
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to get quiz progress for
 *     responses:
 *       200:
 *         description: Successfully retrieved user quiz progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the progress log entry
 *                   user:
 *                     type: string
 *                     description: The ID of the user who made the attempt
 *                   course:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the course
 *                       title:
 *                         type: string
 *                         description: The title of the course
 *                   topic:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the topic
 *                       title:
 *                         type: string
 *                         description: The title of the topic
 *                   activityType:
 *                     type: string
 *                     enum: [quiz, topic, coding, debugging, cicd]
 *                     description: Type of the activity
 *                   activityTable:
 *                     type: string
 *                     description: The table where the activity is stored (e.g., "quizzes")
 *                   activityId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the quiz
 *                       question:
 *                         type: string
 *                         description: The question associated with the quiz
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of when the activity was completed
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of when the entry was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the last update to the entry
 *       404:
 *         description: User or Course not found
 */
router.get(
  "/progress/:userId/:courseId",
  authenticateUser,
  getUserQuizProgress
);
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
