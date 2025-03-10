import { Types } from "mongoose";
import { IUser } from "../interfaces/IUser";
import User from "../models/User";
import { validateEmail, checkUserExists, hashPassword } from "./authService";

//----------------------------------------------------------------
// Validation Functions
//----------------------------------------------------------------
const isValidRole = (role: string): boolean => {
  return ["student", "admin"].includes(role);
};

//----------------------------------------------------------------
// User Service Functions
//----------------------------------------------------------------
export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().select("-password").exec();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const updateUserRole = async (
  userId: string,
  newRole: "student" | "admin"
): Promise<IUser> => {
    console.log("Received userId:", userId);
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }
  if (!isValidRole(newRole)) {
    throw new Error("Invalid role value. Must be 'student' or 'admin'.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  user.role = newRole;
  await user.save();
  return user;
};

export const updateUserProfile = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const createUser = async (
  username: string,
  email: string,
  password: string,
  role: string = "student"
): Promise<IUser> => {
  if (!validateEmail(email)) {
    throw new Error("Invalid email address");
  }

  await checkUserExists(email);

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
