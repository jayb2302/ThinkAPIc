import { IQuiz } from "../interfaces/IQuiz";
import Quiz from "../models/Quiz";
import Topic from "../models/Topic";
import ProgressLog from "../models/ProgressLog";

// ==========================
// Helper Functions
// ==========================

// Validate Quiz Fields 
const validateQuizFields = ({ topic, question, options }: IQuiz) => {
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
};

// Check if the topic exists
const checkTopicExists = async (topicId: string) => {
  const topicExists = await Topic.exists({ _id: topicId });
  if (!topicExists) {
    throw new Error("Invalid topic ID: Topic does not exist.");
  }
};

// Check if at least one option is marked as correct
const checkHasCorrectOption = (options: IQuiz["options"]) => {
  if (!options.some((opt) => opt.isCorrect)) {
    throw new Error("At least one option must be marked as correct.");
  }
};

// Validate the quiz data
const validateQuizData = async (quizData: IQuiz) => {
  validateQuizFields(quizData);
  await checkTopicExists(quizData.topic.toString());
  checkHasCorrectOption(quizData.options);
};

// Validate Quiz Update
const validateQuizUpdate = (quizData: Partial<IQuiz>) => {
  if (!quizData.topic || !quizData.question || !quizData.options) {
    throw new Error(
      "Topic, question, and options are required to update a quiz."
    );
  }
};

// Validate Quiz Attempt
const validateQuizAttempt = (
  data: Partial<{
    userId: string;
    quizId: string;
    selectedOptionOrder: number;
    courseId: string;
  }>
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


// Format Options
const formatOptions = (options: IQuiz["options"]) => {
  return options.map((opt, index) => ({
    text: opt.text.trim(),
    isCorrect: Boolean(opt.isCorrect),
    order: opt.order ?? index + 1,
  }));
};


// ==========================
// Quiz Service Functions
// ==========================
const getQuizWithTopic = async (quizId: string) => {
  const quiz = await Quiz.findById(quizId).populate("topic");
  if (!quiz) throw { status: 404, message: "Quiz not found" };

  if (!quiz.topic) {
    throw { status: 400, message: "Quiz is missing an associated topic" };
  }

  return { quiz, topicId: quiz.topic._id.toString() };
};

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
  await validateQuizData(quizData);
  const formattedOptions = formatOptions(quizData.options);
  const newQuiz = await Quiz.create({
    ...quizData,
    options: formattedOptions,
  });
  return newQuiz;
};

export const updateQuiz = async (
  quizId: string,
  quizData: Partial<IQuiz>
): Promise<IQuiz | null> => {
  // Validate quiz update data
  validateQuizUpdate(quizData);

  // Validate topic format
  const topicId =
    typeof quizData.topic === "string"
      ? new Topic({ _id: quizData.topic })._id
      : quizData.topic;

  const formattedOptions = formatOptions(quizData.options!);

  // Update quiz
  const updatedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    { ...quizData, topic: topicId, options: formattedOptions },
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
}): Promise<{
  message: string;
  isCorrect: boolean;
  topicId: string | null;
}> => {
    validateQuizAttempt({ userId, quizId, selectedOptionOrder, courseId });

    const { quiz, topicId } = await getQuizWithTopic(quizId);

  console.log("📌 Debugging Quiz Attempt:");
  console.log("✅ Fetched Quiz:", quiz);

  console.log("✅ Topic Found:", quiz.topic);

  // Find the selected option
  const option = quiz.options.find((o) => o.order === selectedOptionOrder);
  if (!option) {
    throw { status: 400, message: "Invalid option selected. No matching option found for this quiz."};
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
