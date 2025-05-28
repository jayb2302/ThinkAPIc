import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  _id: string;
  email: string;
  role: "student" | "admin";
  username: string;
}
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select(
      "_id email role username"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role as "student" | "admin",
      username: user.username,
    };
    next();
  } catch (error) {
    //console.error("❌ Token Verification Failed:", error);
    return res.status(403).json({ error: "Invalid or Expired Token" });
  }
};

// Admin Authorization Middleware
export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};
