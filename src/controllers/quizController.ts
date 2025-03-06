import { RequestHandler } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as quizService from "../services/quizService";

// Get all quizzes
export const getQuizzes: RequestHandler = async (req, res): Promise<void> => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// Get a single quiz by ID
export const getQuizById: RequestHandler = async (req, res): Promise<void> => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
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
export const createQuiz: RequestHandler = async (
  req: AuthRequest,
  res
): Promise<void> => {
  try {
    console.log("📥 Received Request Body:", req.body);

    // Ensure the user is authenticated
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized - Please log in" });
      return;
    }

    // Restrict access to admins only
    if (req.user.role !== "admin") {
      res
        .status(403)
        .json({ error: "Forbidden - Only admins can create quizzes" });
      return;
    }

    const newQuiz = await quizService.createQuiz(req.body);

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
export const updateQuiz: RequestHandler = async (
  req: AuthRequest,
  res
): Promise<void> => {
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

    const updatedQuiz = await quizService.updateQuiz(req.params.id, req.body);
    
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
export const deleteQuiz: RequestHandler = async (
  req: AuthRequest,
  res
): Promise<void> => {
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

    const deletedQuiz = await quizService.deleteQuiz(req.params.id);

    if (!deletedQuiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    console.log("✅ Deleted Quiz:", deleteQuiz);
    res.status(200).json({ message: "✅ Quiz deleted successfully" });
  } catch (error) {
    console.error("❌ Error Deleting Quiz:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};

// Attempt a quiz
export const attemptQuiz: RequestHandler = async (
  req: AuthRequest,
  res
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      console.error("❌ User not authenticated:", req.user);
      res.status(401).json({ error: 'Unauthorized - Please log in' });
      return;
    }
    console.log("🔍 Checking req.user:", req.user); // Log the user object
    
    const userId = req.user._id;
    const { quizId, selectedOptionOrder, courseId } = req.body;


    console.log("📌 Quiz Attempt Request:", { userId, quizId, selectedOptionOrder, courseId });
    const result = await quizService.attemptQuiz({ userId, quizId, selectedOptionOrder, courseId });

    res.status(201).json({
      message: '✅ Quiz attempt logged successfully',
      isCorrect: result.isCorrect,
      topicId: result.topicId,
    });
  } catch (error: any) {
    console.error('❌ Error Attempting Quiz:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};
