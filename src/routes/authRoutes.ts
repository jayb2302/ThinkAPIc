import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Check if auth routes are working
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Auth routes are working
 */
router.get("/", (req, res) => {
    res.send("Auth Routes are working!");
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user
 *                 example: "MisterFunny"
 *               email:
 *                 type: string
 *                 description: The email of the new user
 *                 example: "mrfunny@gmail.com"
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *                 example: "password"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   example: { "_id": "string", "username": "username", "email": "email", "role": "student" }
 *       400:
 *         description: Validation error (invalid input)
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/register", register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Unauthorized (wrong credentials)
 *       500:
 *         description: Server error
 */
router.post("/login", login);

export default router;