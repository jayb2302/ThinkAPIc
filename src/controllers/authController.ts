import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    const user = await registerUser(username, email, password, role);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    next(error);
  }
};
