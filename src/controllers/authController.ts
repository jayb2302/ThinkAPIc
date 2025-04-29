import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    const user = await registerUser(username, email, password, role);
    res.status(201).json({ error:null, message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    sendSuccessfulLoginResponse(res, token, user);
  } catch (error: any) {
    handleLoginError(error, res, next);
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const sendSuccessfulLoginResponse = (res: Response, token: string, user: any): void => {
  res.status(200).json({
    message: "✅ Login successful",
    error: null,
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

const handleLoginError = (error: any, res: Response, next: NextFunction): void => {
  console.error("❌ Login Error:", error);

  if (error.status === 400 || error.status === 401) {
    res.status(error.status).json({
      message: error.message,
      error: true,
    });
  } else {
    next(error);
  }
};
