import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";

//------------------------
// Validation Functions
//------------------------

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailRegex.test(email);
};

const verifyPassword = async (
  userPassword: string,
  inputPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, userPassword);
};

export const checkUserExists = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
};

//------------------------
// Helper Functions
//------------------------

const generateToken = (userId: string, role: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Server misconfiguration: JWT_SECRET is missing");
  }

  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

//------------------------
// Service Functions
//------------------------

export const registerUser = async (
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

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: IUser }> => {
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(user.password, password))) {
    const error: any = new Error("Invalid credentials - Email or password is incorrect");
    error.status = 401; 
    throw error;
  }

  const token = generateToken(user._id.toString(), user.role);

  return { token, user };
};
