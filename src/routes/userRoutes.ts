import express from "express";
import { getUsers, getUserById, createUser, updateUserRole, updateUserProfile, deleteUser } from "../controllers/userController";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

// ------------------------------------------
// 🔐 Admin Routes
// ------------------------------------------
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserResponse"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can access
 */
router.get("/", authenticateUser, authorizeAdmin, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67a1fb6a19841151773d89b1"
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can access
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticateUser, authorizeAdmin, getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserRequest"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can create users
 */
router.post("/", authenticateUser, authorizeAdmin, createUser);

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["newRole"]
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: ["student", "admin"]
 *                 description: The new role for the user
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User role updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67a1fb6a19841151773d89b1"
 *                     username:
 *                       type: string
 *                       example: "jaybeaver"
 *                     email:
 *                       type: string
 *                       example: "jonina@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-04T11:35:06.685Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T09:44:31.060Z"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can update roles
 *       404:
 *         description: User not found
 */
router.put("/:id/role", authenticateUser, authorizeAdmin, updateUserRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Only admins can delete users
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticateUser, authorizeAdmin, deleteUser);

// ------------------------------------------
// 🔏 User Routes
// ------------------------------------------
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Updated username"
 *                 example: "jaybeaver"
 *               email:
 *                 type: string
 *                 description: "Updated email address"
 *                 example: "updateduser@example.com"
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: "string"
 *                       example: "67a1fb6a19841151773d89b1"
 *                     username:
 *                       type: "string"
 *                       example: "jaybeaver"
 *                     email:
 *                       type: "string"
 *                       example: "updateduser@example.com"
 *                     role:
 *                       type: "string"
 *                       example: "student"
 *                     createdAt:
 *                       type: "string"
 *                       format: "date-time"
 *                       example: "2025-02-04T11:35:06.685Z"
 *                     updatedAt:
 *                       type: "string"
 *                       format: "date-time"
 *                       example: "2025-02-27T09:44:31.060Z"
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - User cannot update another user's profile
 *       404:
 *         description: User not found
 */
router.put("/:id", authenticateUser, updateUserProfile);

export default router;