import { RequestHandler } from "express";
import User from "../models/User";

// Get all users
export const getUsers: RequestHandler = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};