import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware"; 
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from "../controllers/courseController";

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Admin Routes
router.post("/", authenticateUser, authorizeAdmin, createCourse);
router.put("/:id", authenticateUser, authorizeAdmin, updateCourse);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteCourse);

export default router;