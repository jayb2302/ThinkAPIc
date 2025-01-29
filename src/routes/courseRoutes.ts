import express from "express";
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from "../controllers/courseController";

const router = express.Router();

// Use controllers directly (no need for `as RequestHandler`)
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;