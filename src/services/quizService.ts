import { IQuiz } from "../interfaces/IQuiz";
import Quiz from "../models/Quiz";
import Topic from "../models/Topic";
import ProgressLog from "../models/ProgressLog";

export const getAllQuizzes = async (): Promise<IQuiz[]> => {
  const quizzes = await Quiz.find().populate("topic");
  quizzes.forEach((quiz) => quiz.options.sort((a, b) => a.order - b.order));
  return quizzes;
};

export const getQuizById = async (id: string): Promise<IQuiz | null> => {
  const quiz = await Quiz.findById(id).populate("topic");
  if (!quiz) throw { status: 404, message: "Quiz not found" };
  quiz.options.sort((a, b) => a.order - b.order);
  return quiz;
};

export const createQuiz = async (quizData: IQuiz): Promise<IQuiz> => {
  const { topic, question, options } = quizData;

  // Validation
  if (
    !topic ||
    !question ||
    !options ||
    !Array.isArray(options) ||
    options.length < 2
  ) {
    throw new Error(
      "All fields are required and options must contain at least two choices."
    );
  }

  const topicExists = await Topic.findById(topic);
  if (!topicExists) {
    throw new Error("Invalid topic ID: Topic does not exist.");
  }

  const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
  if (!hasCorrectAnswer) {
    throw new Error("At least one option must be marked as correct.");
  }

  const formattedOptions = options.map((opt, index: number) => ({
    text: opt.text.trim(),
    isCorrect: Boolean(opt.isCorrect),
    order: opt.order ?? index + 1,
  }));

  const newQuiz = await Quiz.create({
    topic,
    question,
    options: formattedOptions,
  });

  return await newQuiz.populate("topic");
};

export const updateQuiz = async (
  quizId: string,
  quizData: Partial<IQuiz>
): Promise<IQuiz | null> => {
  const { topic, question, options } = quizData;

  if (
    !topic ||
    !question ||
    !options ||
    !Array.isArray(options) ||
    options.length < 2
  ) {
    throw new Error("All fields required; minimum two options.");
  }

  const formattedOptions = options
    .map((opt, index) => ({
      text: opt.text.trim(),
      isCorrect: Boolean(opt.isCorrect),
      order: opt.order ?? index + 1,
    }))
    .sort((a, b) => a.order - b.order);

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    { topic, question, options: formattedOptions },
    { new: true, runValidators: true }
  ).populate("topic");

  if (!updatedQuiz) {
    throw { status: 404, message: "Quiz not found" };
  }
  return updatedQuiz;
};

export const deleteQuiz = async (id: string): Promise<IQuiz | null> => {
  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) throw { status: 404, message: "Quiz not found" };
  return quiz;
};

export const attemptQuiz = async ({
    userId,
    quizId,
    selectedOptionOrder,
    courseId,
  }: {
    userId: string;
    quizId: string;
    selectedOptionOrder: number;
    courseId: string;
  }): Promise<{ message: string; isCorrect: boolean; topicId: string | null }> => {
  
    // Validate required fields
    if (!userId || !quizId || !selectedOptionOrder || !courseId) {
      throw { status: 400, message: "Missing required fields: userId, quizId, selectedOptionOrder, courseId" };
    }
  
    // Find the quiz and populate the topic field
    const quiz = await Quiz.findById(quizId).populate("topic");
  
    console.log("📌 Debugging Quiz Attempt:");
    console.log("✅ Fetched Quiz:", quiz);
  
    if (!quiz) {
      throw { status: 404, message: "Quiz not found" };
    }
  
    // Ensure the quiz has a topic
    if (!quiz.topic) {
      console.error(`⚠️ Quiz ${quizId} is missing a topic!`);
      throw { status: 400, message: "Quiz is missing an associated topic" };
    }
  
    console.log("✅ Topic Found:", quiz.topic);
  
    // Extract topic ID safely
    const topicId = quiz.topic._id ? quiz.topic._id.toString() : null;
  
    if (!topicId) {
      console.error(`❌ Topic ID is missing for quiz ${quizId}`);
      throw { status: 500, message: "Topic ID is undefined" };
    }
  
    // Find the selected option
    const option = quiz.options.find((o) => o.order === selectedOptionOrder);
    if (!option) {
      throw { status: 400, message: "Invalid option selected. No matching option found for this quiz." };
    }
  
    // Log the quiz attempt in ProgressLog
    await ProgressLog.create({
      user: userId,
      course: courseId,
      topic: topicId,
      activityType: "quiz",
      activityTable: "quizzes",
      activityId: quiz._id,
      completedAt: new Date(),
    });
  
    return {
      message: "Quiz attempt logged",
      isCorrect: option.isCorrect,
      topicId,
    };
  };
