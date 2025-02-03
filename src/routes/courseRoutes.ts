import express from "express";
import { authenticateUser } from "../middleware/authMiddleware"; 
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from "../controllers/courseController";

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;