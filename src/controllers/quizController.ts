import { RequestHandler } from "express";
import Quiz from "../models/Quiz";
import { AuthRequest } from "../middleware/authMiddleware";

// Get all quizzes
export const getQuizzes: RequestHandler = async (req, res): Promise<void> => {
  try {
    const quizzes = await Quiz.find().populate("topic");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// Get a single quiz by ID
export const getQuizById: RequestHandler = async (req, res): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("topic");
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

// Create a new quiz
export const createQuiz: RequestHandler = async (req: AuthRequest, res): Promise<void> => {
    try {
      console.log("📥 Received Request Body:", req.body);
  
      // Ensure the user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized - Please log in" });
        return;
      }
  
      // Restrict access to admins only
      if (req.user.role !== "admin") {
        res.status(403).json({ error: "Forbidden - Only admins can create quizzes" });
        return;
      }
  
      const { topic, question, options } = req.body;
  
      // Validate input fields
      if (!topic || !question || !options || !Array.isArray(options) || options.length < 2) {
        res.status(400).json({ error: "All fields are required, and options must contain at least two choices." });
        return;
      }
  
      // Validate options structure
      const hasCorrectAnswer = options.some(option => option.isCorrect);
      if (!hasCorrectAnswer) { 
        res.status(400).json({ error: "At least one option must be marked as correct." });
        return;
      }
  
      // Create and save quiz
      const newQuiz = await Quiz.create({
        topic,
        question,
        options,
      });
  
      console.log("✅ Created Quiz:", newQuiz);
      res.status(201).json(newQuiz);
      return; 
    } catch (error) {
      console.error("❌ Error Creating Quiz:", error);
      res.status(500).json({ error: "Failed to create quiz" });
      return; 
    }
  };

// Update a quiz
export const updateQuiz: RequestHandler = async (req: AuthRequest, res): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized - Please log in" });
        return;
      }
  
      // Check if user is an admin
      if (req.user.role !== "admin") {
        res.status(403).json({ error: "Forbidden - Only admins can update quizzes" });
        return;
      }
  
      const { id } = req.params;
      const { topic, question, options } = req.body;
  
      if (!topic || !question || !options || !Array.isArray(options) || options.length < 2) {
        res.status(400).json({ error: "All fields are required, and options must contain at least two choices" });
        return;
      }
  
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        id,
        { topic, question, options },
        { new: true, runValidators: true }
      );
  
      console.log("✅ Updated Quiz:", updatedQuiz);
  
      if (!updatedQuiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
  
      res.status(200).json({ message: "✅ Quiz updated successfully", updatedQuiz });
    } catch (error) {
      console.error("❌ Error Updating Quiz:", error);
      res.status(500).json({ error: "Failed to update quiz" });
    }
  };
// Delete a quiz
export const deleteQuiz: RequestHandler = async (req: AuthRequest, res): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized - Please log in" });
        return;
      }
  
      // Check if user is an admin
      if (req.user.role !== "admin") {
        res.status(403).json({ error: "Forbidden - Only admins can delete quizzes" });
        return;
      }
  
      const { id } = req.params;
  
      // Check if quiz exists
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
  
      // Delete the quiz
      await Quiz.findByIdAndDelete(id);
      console.log("✅ Deleted Quiz:", quiz);
      res.status(200).json({ message: "✅ Quiz deleted successfully" });
    } catch (error) {
      console.error("❌ Error Deleting Quiz:", error);
      res.status(500).json({ error: "Failed to delete quiz" });
    }
  };
