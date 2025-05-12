import Exercise from "../models/Exercise";
import { IExercise } from "../interfaces/IExercise";
import { Types } from "mongoose";
import ProgressLog from "../models/ProgressLog";
import { ActivityType, ActivityTable, IProgressLog } from "../interfaces/IProgressLog";
import Topic from "../models/Topic";

// ------------------------------------------------
// Helper Functions
// ------------------------------------------------
const validateExerciseExists = async (title: string): Promise<void> => {
  const existingExercise = await Exercise.findOne({ title });
  if (existingExercise) {
    throw new Error("An exercise with this title already exists.");
  }
};

const hasMissingFields = (data: Partial<IExercise>): string | null => {
  const requiredFields: (keyof IExercise)[] = [
    "title",
    "topic",
    "difficulty",
    "questions",
  ];
  return requiredFields.some(
    (field) => data[field] === undefined || data[field] === null
  )
    ? "Missing required fields."
    : null;
};

const isValidArray = <T>(arr: T[] | undefined): boolean =>
  Array.isArray(arr) && arr.length > 0;

// Validate that multiple-choice questions have options
const hasInvalidQuestions = (questions: IExercise["questions"]): string | null => {
  if (!isValidArray(questions)) {
    return "At least one question is required.";
  }

  for (const question of questions) {
    if (question.type === "multiple-choice" && (!question.options || question.options.length === 0)) {
      return `Multiple-choice question "${question.question}" must have at least one option.`;
    }
  }

  return null;
};

// Validate an exercise before creation
const validateExercise = (data: Partial<IExercise>): string | null => {
  const { title, topic, difficulty, questions } = data;
  if (!title || !topic || !difficulty || !questions) {
    return "Missing required fields.";
  }
  return hasInvalidQuestions(questions);
};

// Validate an exercise update
const validateExerciseUpdate = (data: Partial<IExercise>): string | null => {
  if (Object.keys(data).length === 0) {
    return "No update data provided.";
  }

  return data.questions ? hasInvalidQuestions(data.questions) : null;
};

// ------------------------------------------------
// Exercise Service Functions
// ------------------------------------------------
export const getAllExercises = async (topicId?: string): Promise<IExercise[]> => {
  const filter = topicId ? { topic: new Types.ObjectId(topicId) } : {};
  return await Exercise.find(filter).populate("topic").exec();
};

export const getExerciseById = async (id: string): Promise<IExercise | null> => {
  return await Exercise.findById(id).populate("topic").exec();
};

export const createExercise = async (exerciseData: IExercise): Promise<IExercise> => {
  try {
    const error = hasMissingFields(exerciseData) || validateExercise(exerciseData);
    if (error) throw new Error(error);
    
    await validateExerciseExists(exerciseData.title);

    const newExercise = new Exercise(exerciseData);
    await newExercise.save();
    return newExercise;
  } catch (error) {
    console.error("Failed to create exercise:", error);
    throw error;
  }
};

export const updateExercise = async (id: string, data: Partial<IExercise>): Promise<IExercise | null> => {
  const validationError = validateExerciseUpdate(data);
  if (validationError) {
    throw new Error(validationError);
  }

  return Exercise.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deleteExercise = async (id: string): Promise<IExercise | null> => {
  const exercise = await Exercise.findByIdAndDelete(id);
  if (!exercise) throw new Error("Exercise not found.");

  return exercise;
};

// Helper function to validate required fields
const validateExerciseAttempt = (
    data: Partial<{ userId: string; exerciseId: string; courseId: string }>
  ) => {
    const missingFields = Object.entries(data)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
  
    if (missingFields.length) {
      throw {
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }
  };
  
  // Helper function to get exercise and topic
  const getExerciseWithTopic = async (
    exerciseId: string
  ): Promise<{ exercise: any; topicId: string }> => {
    const exercise = await Exercise.findById(exerciseId).populate("topic");
    if (!exercise || !exercise.topic) {
      throw {
        status: !exercise ? 404 : 400,
        message: !exercise ? "Exercise not found" : "Invalid exercise: Topic not found",
      };
    }
    return { exercise, topicId: exercise.topic._id.toString() };
  };
  
  // Function to log an exercise attempt
  export const attemptExercise = async (
    exerciseId: string,
    {
      userId,
      courseId,
      isCorrect,
    }: {
      userId: string;
      courseId: string;
      isCorrect: boolean;
    }
  ): Promise<{ message: string; topicId: string | null }> => {
    // Validate required fields
    validateExerciseAttempt({ userId, exerciseId, courseId });
  
    // Fetch exercise and topic
    const { exercise, topicId } = await getExerciseWithTopic(exerciseId);
  
    // Validate the course ID belongs to the topic
    const topic = await Topic.findById(topicId);
    if (!topic) throw { status: 400, message: "Topic not found for this exercise." };
    if (topic.course.toString() !== courseId) {
      throw {
        status: 400,
        message: "Invalid course ID: This exercise's topic does not belong to the provided course.",
      };
    }
  
    // Log the exercise attempt in `ProgressLog`
    await ProgressLog.create({
      user: userId,
      course: courseId,
      topic: topicId,
      activityType: ActivityType.EXERCISE,
      activityTable: ActivityTable.EXERCISES,
      activityId: exercise._id,
      completedAt: new Date(),
      isCorrect,
    });
  
    return {
      message: "Exercise attempt logged",
      topicId,
    };
  };