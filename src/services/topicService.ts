import Topic from "../models/Topic";
import Course from "../models/Course";
import { ITopic, Resource } from "../interfaces/ITopic";
import { Types } from "mongoose";

// ------------------------------------------------
// Helper Functions
// ------------------------------------------------
const validateTopicExists = async (title: string): Promise<void> => {
  const existingTopic = await Topic.findOne({ title });
  if (existingTopic) {
    throw new Error("A topic with this title already exists in the database.");
  }
};

const hasMissingFields = (data: Partial<ITopic>): string | null => {
  const requiredFields: (keyof ITopic)[] = [
    "title",
    "week",
    "summary",
    "key_points",
    "resources",
    "course",
  ];
  return requiredFields.some(
    (field) => data[field] === undefined || data[field] === null
  )
    ? "Missing required fields."
    : null;
};

const isValidArray = <T>(arr: T[] | undefined): boolean =>
  Array.isArray(arr) && arr.length > 0;

const hasInvalidResources = (
  resources: Resource[] | undefined
): string | null => {
  return !isValidArray(resources) ||
    resources!.some(({ title, link }) => !title || !link)
    ? "Resources must be an array with a valid title and link."
    : null;
};

const validateTopic = (data: Partial<ITopic>): string | null => {
  const { title, week, summary, key_points, resources } = data;
  if (!title || !week || !summary || !key_points || !resources ) {
      return "Missing required fields.";
  }
  return null;
};

const validateTopicUpdate = (data: Partial<ITopic>): string | null => {
  return Object.keys(data).length === 0
    ? "No update data provided."
    : (data.key_points && !isValidArray(data.key_points)
        ? "Key points must be a non-empty array."
        : null) ??
        (data.resources && hasInvalidResources(data.resources)
          ? "Resources must be an array with a valid title and link."
          : null);
};

// ------------------------------------------------
// Topic Service Functions
// ------------------------------------------------
export const getAllTopics = async (): Promise<ITopic[]> => {
  return await Topic.find().populate("course").exec();
};

export const getTopicById = async (id: string): Promise<ITopic | null> => {
  return await Topic.findById(id).populate("course").exec();
};

export const createTopic = async (
  topicData: ITopic
): Promise<ITopic> => {
  try {
    const error = hasMissingFields(topicData) || validateTopic(topicData);
    if (error) throw new Error(error);
    await validateTopicExists(topicData.title);

    const newTopic = new Topic(topicData);
    await newTopic.save();

    await Course.findByIdAndUpdate(
      newTopic.course,
      { $push: { topics: newTopic._id } },
      { new: true }
    );

    return newTopic;
  } catch (error) {
    console.error("Failed to create topic:", error);
    throw error;
  }
};

export const updateTopic = async (
  id: string,
  data: Partial<ITopic>
): Promise<ITopic | null> => {
  const validationError = validateTopicUpdate(data);
  if (validationError) {
    throw new Error(validationError);
  }

  const existingTopic = await Topic.findById(id);
  if (!existingTopic) {
    throw new Error("Topic not found.");
  }

  if (data.course && typeof data.course === 'string') {
    data.course = Types.ObjectId.createFromHexString(data.course);
  }
  
  // Check if course is being changed
  const oldCourseId = existingTopic.course?.toString();
  const newCourseId = data.course?.toString();

  if (newCourseId && oldCourseId !== newCourseId) {
    // Remove topic ID from old course
    await Course.findByIdAndUpdate(oldCourseId, {
      $pull: { topics: existingTopic._id },
    });

    // Add topic ID to new course
    await Course.findByIdAndUpdate(newCourseId, {
      $addToSet: { topics: existingTopic._id },
    });
  }

  return Topic.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deleteTopic = async (id: string): Promise<ITopic | null> => {
  const topic = await Topic.findByIdAndDelete(id);
  if (!topic) throw new Error("Topic not found.");

  return topic;
};
