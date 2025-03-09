import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topicController";

const router = express.Router();
/**
 * @swagger
 * tags:
 *  name: Topics
 *  description: API endpoints for topics
 */

// Public routes
/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Get all topics
 *     tags: [Topics]
 *     responses:
 *       200:
 *         description: A list of topics.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopicResponse'
 */
router.get("/", getTopics);

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Get a single topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 679b42460a99919e3b623a76
 *         required: true
 *         description: The topic ID
 *     responses:
 *       200:
 *         description: The requested topic.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicResponse'
 *       404:
 *         description: Topic not found
 */
router.get("/:id", getTopicById);

// Admin Routes
/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TopicRequest'
 *     responses:
 *       201:
 *         description: Topic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicResponse'
 *       400:
 *         description: Bad request (validation error or topic already exists)
 *       401:
 *         description: Unauthorized - No token Provided
 *       403: 
 *         description: Forbidden - Only Admins can create topics
 */
router.post("/", authenticateUser, authorizeAdmin, createTopic);

/**
 * @swagger
 * /api/topics/{id}:
 *   put:
 *     summary: Update an existing topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 679b42460a99919e3b623a76  
 *         required: true
 *         description: The topic ID
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TopicRequest'
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - No Token Provided
 *       403:
 *        description: Forbidden - Only admins can update topics
 *       404:
 *         description: Topic not found
 */
router.put("/:id", authenticateUser, authorizeAdmin, updateTopic);

/**
 * @swagger
 * /api/topics/{id}:
 *   delete:
 *     summary: Delete a topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string 
 *         required: true
 *         description: The topic ID
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       401:
 *         description: Unauthorized - No Token Provided
 *       403:
 *         description: Forbidden - Only admins can delete topics
 *       404:
 *         description: Topic not found
 */
router.delete("/:id", authenticateUser, authorizeAdmin, deleteTopic);

export default router;
