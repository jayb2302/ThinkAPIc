import { createTopic } from "./topicService";
import { ICourse } from "../interfaces/ICourse";
import Course from "../models/Course";
import { ITopic } from "../interfaces/ITopic";
import { Types } from "mongoose";

//------------------------
// Validation Functions
//------------------------
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

//------------------------
// Helper Functions
//------------------------
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

// New course creation
const createNewCourse = async (courseData: Partial<ICourse>) => {
  const newCourse = new Course(courseData);
  return handleDatabaseOperation(newCourse.save(), "create course");
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
    console.error("Failed to create topics:", error);
    throw new Error("Failed to create topics");
  }
};

const createTopicsWithCourse = async (
  topicsData: ITopic[],
  _courseId: Types.ObjectId
): Promise<Types.ObjectId[]> => {
  try {
    const topicIds = await createTopics(topicsData);
    return topicIds;
  } catch (error) {
    throw new Error("Failed to create topics with course");
  }
};

//------------------------
// Service Functions
//------------------------

// Get all courses
export const getCourses = async (): Promise<ICourse[]> => {
  return handleDatabaseOperation(Course.find(), "fetch courses");
};

// Get a single course by ID
export const getCourseById = async (id: string): Promise<ICourse | null> => {
  return handleDatabaseOperation(Course.findById(id), "fetch course");
};

// Create a new course with topics
export const createCourseWithTopics = async (
  courseData: Partial<ICourse>,
  topicsData: ITopic[]
): Promise<ICourse> => {
  // Validate course and topics data
  const validationError = validateCourseData(courseData);
  if (validationError) throw new Error(validationError);
  validateTopicsData(topicsData);

  // Create the course
  const createdCourse = await createNewCourse(courseData);

  // Create topics and associate them with the course
  const createdTopicIds = await createTopicsWithCourse(
    topicsData,
    createdCourse._id
  );

  // Save course with associated topics
  createdCourse.topics = createdTopicIds;
  return handleDatabaseOperation(
    createdCourse.save(),
    "update course with topics"
  );
};

// Creata a new course
// export const createCourse = async (data: Partial<ICourse>): Promise<ICourse> => {
//     const validationError = validateCourseData(data);
//     if (validationError) {
//         throw new Error(validationError);
//     }

//     const newCourse = new Course(data);
//     return handleDatabaseOperation(newCourse.save(), "create course");
// };

// Update an existing course
export const updateCourse = async (
  id: string,
  data: Partial<ICourse>
): Promise<ICourse | null> => {
  return handleDatabaseOperation(
    Course.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
    "update course"
  );
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  return handleDatabaseOperation(Course.findByIdAndDelete(id), "delete course");
};
