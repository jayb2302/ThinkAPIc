import { RequestHandler, Request, Response } from "express";
import Topic from "../models/Topic";

// get all topics
export const getTopics: RequestHandler = async (req, res): Promise<void> => {
    try {
        const topics = await Topic.find().populate("course");
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch topics" });
    }
};

// Get a single topic by ID
export const getTopicById: RequestHandler = async (req, res): Promise<void> => {
    try {
        const topic = await Topic.findById(req.params.id).populate("course");
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
export const createTopic: RequestHandler = async (req, res) => {
    try {
        const { title, week, summary, key_points, resources, course } = req.body;
        
        if (!title || !week || !summary || !key_points || !resources || !course) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        
        const newTopic = new Topic({ title, week, summary, key_points, resources, course });
        await newTopic.save();
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({ error: "Failed to create topic" });
    }
};

// Update an existing topic
export const updateTopic: RequestHandler = async (req, res): Promise<void> => {
    try {
        const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTopic) {
            res.status(404).json({ error: "Topic not found" });
            return;
        }
        res.status(200).json(updatedTopic);
    } catch (error) {
        res.status(500).json({ error: "Failed to update Topic" });
    }
};

// Delete a topic
export const deleteTopic: RequestHandler = async (req, res): Promise<void> => {
    try {
        const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
        if (!deletedTopic) {
            res.status(404).json({ error: "Topic not found" });
            return;
        }
        res.status(200).json(deletedTopic);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete topic" });
    }
};