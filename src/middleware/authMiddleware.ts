import User from '../models/User';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  _id: string;
  email: string;
  role: 'student' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}


// Secure Authentication Middleware
export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header("Authorization");

    // Validate token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ No Token Provided");
        res.status(401).json({ error: "Unauthorized: No Token Provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { 
            userId: string; 
        };
        console.log("✅ Decoded JWT:", decoded);

        const user = await User.findById(decoded.userId).select('_id email role');
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        req.user = {
            _id: user._id.toString(),
            email: user.email,
            role: user.role as "student" | "admin",
        };
        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error);
        res.status(403).json({ error: "Invalid or Expired Token" });
        return;
    }
};

// Admin Authorization Middleware
export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction):void => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ error: "Forbidden: Admins only" });
        return 
    }
    next();
};