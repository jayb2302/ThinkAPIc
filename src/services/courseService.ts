import { createTopic } from "./topicService";
import { ICourse } from "../interfaces/ICourse";
import Course from "../models/Course";
import { ITopic } from "../interfaces/ITopic";
import { Types } from "mongoose";
import User from "../models/User"; // Import User model

//----------------------------------------------------------------
// Validation Functions
//----------------------------------------------------------------
const validateCourseData = (data: Partial<ICourse>): string | null => {
  const { title, description } = data;
  if (!title || !description) {
    return "Missing required fields.";
  }
  return null;
};

const validateTopicsData = (topicsData: ITopic[]): void => {
  if (!Array.isArray(topicsData)) {
    throw new Error("topicsData must be an array.");
  }
};

const checkCourseExists = async (title: string): Promise<boolean> => {
  const existingCourse = await Course.findOne({ title });
  return !!existingCourse;
};

//----------------------------------------------------------------
// Helper Functions
//----------------------------------------------------------------
const handleDatabaseOperation = async (
  operation: Promise<any>,
  context: string
) => {
  try {
    const result = await operation;
    if (!result) {
      throw new Error(`${context} not found`);
    }
    return result;
  } catch (error) {
    handleError(context, error);
  }
};

const handleError = (message: string, error: any) => {
  console.error(message, error);
  throw new Error(message);
};

const validateTeacherIsAdmin = async (teacherId: string): Promise<void> => {
  const teacherUser = await User.findById(teacherId);
  if (!teacherUser || teacherUser.role !== "admin") {
    throw new Error("Teacher must be a user with admin role.");
  }
};

//----------------------------------------------------------------
// Create and Save Helpers
//----------------------------------------------------------------
const createEntityWithSession = async <T>(
  entity: any,
  session: any,
  operationName: string
): Promise<T> => {
  return handleDatabaseOperation(entity.save(), operationName);
};

const createNewCourse = async (courseData: Partial<ICourse>): Promise<ICourse> => {
  const newCourse = new Course(courseData);
  return await createEntityWithSession<ICourse>(newCourse, null, "create course");
};

const createTopics = async (
  topicsData: ITopic[]
): Promise<Types.ObjectId[]> => {
  try {
    const createdTopics = await Promise.all(
      topicsData.map(async (topicData) => {
        const createdTopic = await createTopic(topicData);
        return createdTopic._id;
      })
    );
    return createdTopics as Types.ObjectId[];
  } catch (error) {
    throw error;
  }
};

//----------------------------------------------------------------
// Service Functions
//----------------------------------------------------------------
export const getCourses = async (): Promise<ICourse[]> => {
  return handleDatabaseOperation(Course.find(), "Fetch courses");
};

export const getCourseById = async (id: string): Promise<ICourse | null> => {
  return handleDatabaseOperation(Course.findById(id), "Fetch course");
};

export const createCourseWithTopics = async (
  courseData: Partial<ICourse>,
  topicsData: ITopic[]
): Promise<ICourse> => {
  const validationError = validateCourseData(courseData);
  if (validationError) throw new Error(validationError);
  validateTopicsData(topicsData);

  if (!courseData.teacher) {
    throw new Error("Teacher ID is required.");
  }
  await validateTeacherIsAdmin(courseData.teacher.toString());

  // Check if course already exists by title
  if (await checkCourseExists(courseData.title!)) {
    throw new Error("A course with this title already exists.");
  }

  try {
    const createdCourse = await createNewCourse(courseData);

    const createdTopicIds = await createTopics(topicsData);

    createdCourse.topics = createdTopicIds;
    await createdCourse.save();

    return createdCourse;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (
  id: string,
  data: Partial<ICourse>
): Promise<ICourse | null> => {
  return handleDatabaseOperation(
    Course.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
    "Update course"
  );
};

export const deleteCourse = async (id: string): Promise<void> => {
  return handleDatabaseOperation(Course.findByIdAndDelete(id), "Delete course");
};
