import { RequestHandler } from "express";
import * as exerciseService from "../services/exerciseService";
import { startSession } from "mongoose";

//-------------------------------------------------------
// Exercise Controller Functions
//-------------------------------------------------------
export const getExercises: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { topicId } = req.query;
    const exercises = await exerciseService.getAllExercises(topicId as string);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

export const getExerciseById: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const exercise = await exerciseService.getExerciseById(req.params.id);
    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
};

export const createExercise: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const session = await startSession();
  session.startTransaction();

  try {
    const newExercise = await exerciseService.createExercise(req.body);

    // Commit the transaction
    await session.commitTransaction();
    res.status(201).json(newExercise);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateExercise: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const updatedExercise = await exerciseService.updateExercise(
      req.params.id,
      req.body
    );
    if (!updatedExercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }
    res.status(200).json(updatedExercise);
  } catch (error) {
    next(error);
  }
};

export const deleteExercise: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const deletedExercise = await exerciseService.deleteExercise(req.params.id);
    if (!deletedExercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Exercise deleted successfully", deletedExercise });
  } catch (error) {
    next(error);
  }
};

export const logExerciseAttempt: RequestHandler = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { userId, courseId } = req.body;

    const result = await exerciseService.attemptExercise(exerciseId, {
      userId,
      courseId,
      isCorrect: true,
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
