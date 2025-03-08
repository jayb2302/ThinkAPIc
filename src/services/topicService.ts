import Topic from "../models/Topic";
import { ITopic, Resource } from "../interfaces/ITopic";
import { IUser } from "../interfaces/IUser";

// ----------------------
// Helper Functions
// ----------------------

// Validate if user is an admin
const validateUserPermissions = (user: IUser): void => {
  if (!user) {
    throw new Error("Unauthorized - Please log in");
  }

  if (user.role !== "admin") {
    throw new Error("Forbidden - Only admins can delete topics");
  }
};

// Validate if topic exists
const validateTopicExists = async (title: string): Promise<void> => {
  const existingTopic = await Topic.findOne({ title });
  if (existingTopic) {
    throw new Error("A topic with this title already exists in the database.");
  }
};

// Validate Topic Fields
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

// Validate Topic Fields
const validateTopic = (data: Partial<ITopic>): string | null => {
  console.log('Validating topic data:', data);  // Add this line to log the topic data

  const { title, week, summary, key_points, resources } = data;
  if (!title || !week || !summary || !key_points || !resources ) {
      return "Missing required fields.";
  }
  return null;
};

// Validate Topic Update
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

// ----------------------
// Service Functions
// ----------------------

// Get all topics
export const getAllTopics = async (): Promise<ITopic[]> => {
  return await Topic.find().populate("course").exec();
};

// Get a single topic by ID
export const getTopicById = async (id: string): Promise<ITopic | null> => {
  return await Topic.findById(id).populate("course").exec();
};

// Create a new topic
export const createTopic = async (data: Partial<ITopic>): Promise<ITopic> => {
  await validateTopicExists(data.title as string);

  const validationError = validateTopic(data);
  if (validationError) {
    throw new Error(validationError);
  }

  const newTopic = new Topic(data);
  return await newTopic.save();
};

// Update an existing topic
export const updateTopic = async (
  id: string,
  data: Partial<ITopic>
): Promise<ITopic | null> => {
  const error =
    validateTopicUpdate(data) ||
    (!(await Topic.exists({ _id: id })) && "Topic not found.");
  if (error) throw new Error(error);

  return Topic.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};

// Delete a topic
export const deleteTopic = async (id: string): Promise<ITopic | null> => {
  const topic = await Topic.findByIdAndDelete(id);
  if (!topic) throw new Error("Topic not found.");

  return topic;
};
