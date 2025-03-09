import { RequestHandler, NextFunction } from "express";
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

// Get quizzes by topic
export const getQuizzesByTopic: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { topicId } = req.params;
    const quizzes = await quizService.getQuizzesByTopic(topicId);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("❌ Error Fetching Quizzes by Topic:", error);
    next(error); 
  }
};

// Get user's quiz attempts
export const getUserQuizAttempts: RequestHandler = async (req, res, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const attempts = await quizService.getUserQuizAttempts(userId);
    res.status(200).json(attempts);
  } catch (error) {
    next(error);
  }
};

// Get Quiz Progress for a user
export const getUserQuizProgress: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { userId, courseId } = req.params;

    const progress = await quizService.getUserQuizProgress(userId, courseId);

    // Handle case where no progress is found
    if (!progress.length) {
      res.status(404).json({ error: "No quiz progress found for this user in this course." });
      return 
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("❌ Error Fetching Quiz Progress:", error);
    next(error);
  }
};

// Create a new quiz
export const createQuiz: RequestHandler = async (
  req: AuthRequest,
  res,
  next
): Promise<void> => {
  try {
    console.log("📥 Received Request Body:", req.body);

    const newQuiz = await quizService.createQuiz(req.body);

    console.log("✅ Created Quiz:", newQuiz);
    res.status(201).json(newQuiz);
    return;
  } catch (error) {
    console.error("❌ Error Creating Quiz:", error);
    next(error);
  }
};

// Update a quiz
export const updateQuiz: RequestHandler = async (
  req: AuthRequest,
  res,
  next
): Promise<void> => {
  try {
    const updatedQuiz = await quizService.updateQuiz(req.params.id, req.body);
    
    console.log("✅ Updated Quiz:", updatedQuiz);

    if (!updatedQuiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    res.status(200).json({ message: "✅ Quiz updated successfully", updatedQuiz });
  } catch (error) {
    console.error("❌ Error Updating Quiz:", error);
    next(error);
  }
};
// Delete a quiz
export const deleteQuiz: RequestHandler = async (
  req: AuthRequest,
  res,
  next
): Promise<void> => {
  try {

    await quizService.deleteQuiz(req.params.id);

    console.log("✅ Deleted Quiz:", deleteQuiz);
    res.status(200).json({ message: "✅ Quiz deleted successfully" });
  } catch (error) {
    console.error("❌ Error Deleting Quiz:", error);
    next(error);
  }
};

// Attempt a quiz
export const attemptQuiz: RequestHandler = async (
  req: AuthRequest,
  res,
  next
): Promise<void> => {
  try {

    const quizId = req.params.id;
    const { selectedOptionOrder, courseId } = req.body;
    const userId = req.user!._id;

    console.log("📌 Quiz Attempt Request:", { userId, quizId, selectedOptionOrder, courseId });
    const result = await quizService.attemptQuiz(quizId, { userId, selectedOptionOrder, courseId });

    res.status(201).json({
      message: '✅ Quiz attempt logged successfully',
      isCorrect: result.isCorrect,
      topicId: result.topicId,
    });
  } catch (error) {
    console.error('❌ Error Attempting Quiz:', error);
    next(error);
  }
};


