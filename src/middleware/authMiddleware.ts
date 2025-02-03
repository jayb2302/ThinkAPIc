import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

// Secure Authentication Middleware
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized: No Token Provided" });

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or Expired Token" });
    }
};