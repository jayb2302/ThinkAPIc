import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import { loginSchema, registerSchema } from "../utils/validationSchemas";
import { connectDB } from "../config/database";

//------------------------
// Validation Functions
//------------------------

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
  const { error, value } = registerSchema.validate({
    username,
    email,
    password,
    role,
  });

  if (error) {
    const validationError: any = new Error(
      `Validation error: ${error.message}`
    );
    validationError.status = 400;
    throw validationError;
  }

  await connectDB();
  await checkUserExists(value.email);

  const hashedPassword = await hashPassword(value.password);

  const user = await User.create({
    username: value.username,
    email: value.email,
    password: hashedPassword,
    role: value.role,
  });
  const userResponse = await User.findById(user._id).select(
    "-createdAt -updatedAt -__v"
  );
  return userResponse as IUser;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: IUser }> => {
  const { error, value } = loginSchema.validate({ email, password });
  if (error) {
    const validationError: any = new Error(
      `Validation error: ${error.message}`
    );
    validationError.status = 400;
    throw validationError;
  }

  const user = await User.findOne({ email: value.email });
  if (!user || !(await verifyPassword(user.password, value.password))) {
    const error: any = new Error(
      "Invalid credentials - Email or password is incorrect"
    );
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id.toString(), user.role);

  return { token, user };
};
