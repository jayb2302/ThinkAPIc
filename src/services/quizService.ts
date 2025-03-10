import { IQuiz } from "../interfaces/IQuiz";
import Quiz from "../models/Quiz";
import Topic from "../models/Topic";
import Course from "../models/Course";
import ProgressLog from "../models/ProgressLog";
import { ActivityType, IProgressLog } from "../interfaces/IProgressLog";

// ---------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------
const validateQuizFields = ({ topic, question, options }: IQuiz) => {
  if (
    !topic ||
    !question ||
    !options ||
    !Array.isArray(options) ||
    options.length < 2
  ) {
    throw {
      status: 400,
      message:
        "All fields are required, and options must contain at least two choices.",
    };
  }
};

const validateTopicCourse = async (topicId: string, courseId: string) => {
  const topic = await Topic.findById(topicId);
  if (!topic) {
    throw { status: 400, message: "Topic not found for this quiz." };
  }
  if (topic.course.toString() !== courseId) {
    throw {
      status: 400,
      message:
        "Invalid course ID: This quiz's topic does not belong to the provided course.",
    };
  }
};

const validateQuiz = async (quizData: Partial<IQuiz>, isUpdate = false) => {
  if (isUpdate) {
    if (!quizData.topic && !quizData.question && !quizData.options) {
      throw new Error("At least one field (topic, question, or options) must be provided to update a quiz.");
    }
    if (quizData.options) {
      validateQuizFields(quizData as IQuiz); 
    }
  } else {
    validateQuizFields(quizData as IQuiz);
    await checkTopicExists(quizData.topic!.toString());
    checkHasCorrectOption(quizData.options!);
  }
};

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

const checkTopicExists = async (topicId: string) => {
  const topicExists = await Topic.exists({ _id: topicId });
  if (!topicExists) {
    throw new Error("Invalid topic ID: Topic does not exist.");
  }
};

const checkCourseExists = async (courseId: string) => {
  const courseExists = await Course.exists({ _id: courseId });
  if (!courseExists) {
    throw new Error("Invalid course ID: Course does not exist.");
  }
};

const checkHasCorrectOption = (options: IQuiz["options"]) => {
  if (!options.some((opt) => opt.isCorrect)) {
    throw new Error("At least one option must be marked as correct.");
  }
};

const formatOptions = (options: IQuiz["options"]) => {
  return options.map((opt, index) => ({
    text: opt.text.trim(),
    isCorrect: Boolean(opt.isCorrect),
    order: opt.order ?? index + 1,
  }));
};

// ---------------------------------------------------------------
// Quiz Service Functions
// ---------------------------------------------------------------
const getQuizWithTopic = async (
  quizId: string
): Promise<{ quiz: IQuiz; topicId: string }> => {
  const quiz = await Quiz.findById(quizId).populate("topic");
  if (!quiz || !quiz.topic) {
    throw {
      status: !quiz ? 404 : 400,
      message: !quiz ? "Quiz not found" : "Invalid quiz: Topic not found",
    };
  }
  return { quiz, topicId: quiz.topic._id.toString() };
};

export const getAllQuizzes = async (): Promise<IQuiz[]> => {
  const quizzes = await Quiz.find().populate('_id');
  quizzes.forEach((quiz) => quiz.options.sort((a, b) => a.order - b.order));
  return quizzes;
};

export const getQuizById = async (id: string): Promise<IQuiz | null> => {
  const quiz = await Quiz.findById(id).populate("topic");
  if (!quiz) throw { status: 404, message: "Quiz not found" };
  quiz.options.sort((a, b) => a.order - b.order);
  return quiz;
};

export const getQuizzesByTopic = async (topicId: string): Promise<IQuiz[]> => {
  await checkTopicExists(topicId);

  // Fetch quizzes and using lean() to return plain JS objects
  const quizzes = await Quiz.find({ topic: topicId }).populate("topic").lean();

  if (!quizzes || quizzes.length === 0) {
    throw { status: 404, message: "No quizzes found for this topic." };
  }

  return quizzes;
};

export const getUserQuizAttempts = async (
  userId: string
): Promise<IProgressLog[]> => {
  try {
    const attempts = await ProgressLog.find({
      user: userId,
      activityType: ActivityType.QUIZ,
    })
      .populate({ path: "course", select: "title _id" })
      .populate({ path: "topic", select: "title _id" })
      .populate({ path: "activityId", select: "question" })
      .lean();

    if (!attempts.length) {
      throw { status: 404, message: "No quiz attempts found for this user." };
    }

    return attempts;
  } catch (error) {
    throw error;
  }
};

export const getUserQuizProgress = async (
  userId: string,
  courseId: string
): Promise<IProgressLog[]> => {
  await checkCourseExists(courseId);
  return await ProgressLog.find({
    user: userId,
    course: courseId,
    activityType: ActivityType.QUIZ,
  })
    .populate({ path: "activityId", model: "Quiz", select: "question" })
    .populate({ path: "topic", model: "Topic", select: "title _id" })
    .populate({ path: "course", select: "title _id" })
    .lean();
};

export const attemptQuiz = async (
  quizId: string,
  {
    userId,
    selectedOptionOrder,
    courseId,
  }: {
    userId: string;
    selectedOptionOrder: number;
    courseId: string;
  }
): Promise<{
  message: string;
  isCorrect: boolean;
  topicId: string | null;
}> => {
  validateQuizAttempt({ userId, quizId, selectedOptionOrder, courseId });

  const { quiz, topicId } = await getQuizWithTopic(quizId);
  await validateTopicCourse(topicId, courseId);

  checkHasCorrectOption(quiz.options);

  // Find the selected option
  const option = quiz.options.find((o) => o.order === selectedOptionOrder);
  if (!option) {
    throw {
      status: 400,
      message:
        "Invalid option selected. No matching option found for this quiz.",
    };
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

export const createQuiz = async (quizData: IQuiz): Promise<IQuiz> => {
  await validateQuiz(quizData);

  const formattedOptions = formatOptions(quizData.options);
  const newQuiz = await Quiz.create({
    ...quizData,
    topic: quizData.topic,
    options: formattedOptions,
  });
  return newQuiz;
};

export const updateQuiz = async (
  quizId: string,
  quizData: Partial<IQuiz>
): Promise<IQuiz | null> => {
  await validateQuiz(quizData, true);

  const formattedOptions = formatOptions(quizData.options!);

  // Update quiz
  const updatedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    { ...quizData, options: formattedOptions },
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
