import { RequestHandler } from "express";
import Course from "../models/Course";

// Get all courses
export const getCourses: RequestHandler = async (req, res): Promise<void> => {
    try {
        const courses = await Course.find();
        if (!courses || courses.length === 0) {
            res.status(404).json({ error: "No courses found" });
            return;
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
};

// Get a single course by ID
export const getCourseById: RequestHandler = async (req, res): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch course" });
    }
};

// Create a new course
export const createCourse: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { title, description } = req.body;
        const newCourse = new Course({ title, description });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: "Failed to create course" });
    }
};

// Update an existing course
export const updateCourse: RequestHandler = async (req, res): Promise<void> => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: "Failed to update course" });
    }
};

// Delete a course
export const deleteCourse: RequestHandler = async (req, res): Promise<void> => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete course" });
    }
};