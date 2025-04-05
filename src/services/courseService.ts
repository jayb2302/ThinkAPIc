import { createTopic } from "./topicService";
import { ICourse } from "../interfaces/ICourse";
import Course from "../models/Course";
import { ITopic } from "../interfaces/ITopic";
import { Types } from "mongoose";

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

//----------------------------------------------------------------
// Create and Save Helpers
//----------------------------------------------------------------
const createEntityWithSession = async <T>(
  entity: any,
  session: any,
  operationName: string
): Promise<T> => {
  return handleDatabaseOperation(entity.save({ session }), operationName);
};

const createNewCourse = async (courseData: Partial<ICourse>, session: any) => {
  const newCourse = new Course(courseData);
  return await createEntityWithSession<ICourse>(newCourse, session, "create course");
};

const createTopics = async (
  topicsData: ITopic[],
  session: any
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

  // Check if course already exists by title
  if (await checkCourseExists(courseData.title!)) {
    throw new Error("A course with this title already exists.");
  }
  // Start session for transaction
  const session = await Course.startSession();
  session.startTransaction();

  try {
    const createdCourse = await createNewCourse(courseData, session);

    const createdTopicIds = await createTopics(topicsData, session);

    // Save course with associated topics
    createdCourse.topics = createdTopicIds;
    await createEntityWithSession<ICourse>(createdCourse, session, "Update course with topics");

    await session.commitTransaction();
    session.endSession();

    return createdCourse;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
