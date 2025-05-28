import { RequestHandler } from "express";
import * as userService from "../services/userService";

// Get all users
export const getUsers: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
export const getUserById: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Get all admin users
export const getAdminUsers: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const admins = await userService.getAdminUsers();
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

// Create a new user
export const createUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = await userService.createUser(
      username,
      email,
      password,
      role
    );
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    next(error);
  }
};

// Update user role
export const updateUserRole: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;
    const updatedUser = await userService.updateUserRole(id, newRole);
    res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUserProfile: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { id } = req.params;
    const upadteData = req.body;
    const updatedUser = await userService.updateUserProfile(id, upadteData);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { id } = req.params; // Extract user id from params
    const deletedUser = await userService.deleteUser(id); 
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    next(error); 
  }
};