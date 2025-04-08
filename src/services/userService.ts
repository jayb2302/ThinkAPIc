import { Types } from "mongoose";
import { IUser } from "../interfaces/IUser";
import User from "../models/User";
import { checkUserExists, hashPassword } from "./authService";
import { registerSchema } from "../utils/validationSchemas";

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
  return await User.findById(id).select("_id username email").exec();
};

export const getAdminUsers = async (): Promise<IUser[]> => {
  return await User.find({ role: "admin" }).select("_id username").exec();
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
  const { error, value } = registerSchema.validate({ username, email, password, role });
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }

  await checkUserExists(value.email);

  const hashedPassword = await hashPassword(value.password);

  const user = await User.create({
    username: value.username,
    email: value.email,
    password: hashedPassword,
    role: value.role,
  });

  return user;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
