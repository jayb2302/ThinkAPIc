import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware"; 
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from "../controllers/courseController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API endpoints for managing courses
 */

//--------------------------------------------
//🔓 Public routes
//--------------------------------------------

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Retrieve all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully retrieved all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CourseResponse"
 */
router.get("/", getCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "679b42460a99919e3b623a74"
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseResponse"
 *       404:
 *         description: Course not found
 */
router.get("/:id", getCourseById);

//--------------------------------------------
// 🔐 Admin Routes
//--------------------------------------------
/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseRequest"
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseResponse"
 *       400:
 *         description: Validation error - Missing required fields
 *       401:
 *         description: Unauthorized - No Token Provided
 *       403:
 *         description: Forbidden - Only Admins can create courses
 */
router.post("/", authenticateUser, authorizeAdmin, createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "679b42460a99919e3b623a74"
 *         description: The ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseRequest"
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseResponse"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - No Token Provided
 *       403:
 *         description: Forbidden - Only Admins can update courses
 *       404:
 *         description: Course not found
 */
router.put("/:id", authenticateUser, authorizeAdmin, updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "679b42460a99919e3b623a74"
 *         description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized - No Token Provided
 *       403:
 *         description: Forbidden - Only Admins can delete courses
 *       404:
 *         description: Course not found
 */
router.delete("/:id", authenticateUser, authorizeAdmin, deleteCourse);

export default router;