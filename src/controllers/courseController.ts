import { RequestHandler } from "express";
import * as courseService from "../services/courseService";

// Get all courses
export const getCourses: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const courses = await courseService.getCourses();
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    next(error);
  }
};

// Get a single course by ID
export const getCourseById: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// Create a new course
export const createCourse: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { courseData, topicsData } = req.body;
    console.log("Received topicsData:", topicsData);
    console.log("Received courseData:", courseData);
    const newCourse = await courseService.createCourseWithTopics(
      courseData,
      topicsData
    );
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

// Update an existing course
export const updateCourse: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const updatedCourse = await courseService.updateCourse(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// Delete a course
export const deleteCourse: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
