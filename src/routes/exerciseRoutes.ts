import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  logExerciseAttempt,
} from "../controllers/exerciseController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Exercises
 *  description: API endpoints for exercises
 */

//--------------------------------------------
// 🔓 Public Routes
//--------------------------------------------
/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: topicId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter exercises by topic ID
 *     responses:
 *       200:
 *         description: A list of exercises.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExerciseResponse'
 */
router.get("/", getExercises);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Get a single exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 679b42460a99919e3b623a76
 *         required: true
 *         description: The exercise ID
 *     responses:
 *       200:
 *         description: The requested exercise.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExerciseResponse'
 *       404:
 *         description: Exercise not found
 */
router.get("/:id", getExerciseById);

//--------------------------------------------
// 🔐 Admin Routes
//--------------------------------------------
/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseRequest'
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExerciseResponse'
 *       400:
 *         description: Bad request (validation error or duplicate exercise)
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only Admins can create exercises
 */
router.post("/", authenticateUser, authorizeAdmin, createExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Update an existing exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 679b42460a99919e3b623a76  
 *         required: true
 *         description: The exercise ID
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseRequest'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExerciseResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can update exercises
 *       404:
 *         description: Exercise not found
 */
router.put("/:id", authenticateUser, authorizeAdmin, updateExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string 
 *         required: true
 *         description: The exercise ID
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can delete exercises
 *       404:
 *         description: Exercise not found
 */
router.delete("/:id", authenticateUser, authorizeAdmin, deleteExercise);


//--------------------------------------------
// 🔐 User Routes
//--------------------------------------------
router.post("/:exerciseId/attempt", authenticateUser, logExerciseAttempt);


export default router;