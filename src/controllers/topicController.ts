import { RequestHandler } from "express";
import * as topicService from "../services/topicService";

// get all topics
export const getTopics: RequestHandler = async (req, res): Promise<void> => {
  try {
    const topics = await topicService.getAllTopics();
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
};

// Get a single topic by ID
export const getTopicById: RequestHandler = async (req, res): Promise<void> => {
  try {
    const topic = await topicService.getTopicById(req.params.id);
    if (!topic) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch topic" });
  }
};

// Create a new topic
export const createTopic: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    console.log("Request body:", req.body);
    const newTopic = await topicService.createTopic(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    console.log("Error creating topic:", error);
    next(error);
  }
};

// Update an existing topic
export const updateTopic: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const updatedTopic = await topicService.updateTopic(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedTopic);
  } catch (error) {
    next(error);
  }
};

// Delete a topic
export const deleteTopic: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const deletedTopic = await topicService.deleteTopic(req.params.id);
    res
      .status(200)
      .json({ message: "Topic deleted successfully", deletedTopic });
  } catch (error) {
    next(error);
  }
};