import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { _id: string; email: string; role:string };
}

// Secure Authentication Middleware
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction):void => {
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
            email: string; 
            role: string;
        };
        console.log("✅ Decoded JWT:", decoded);
        req.user = {
            _id: decoded.userId,
            email: decoded.email || "no-email",
            role: decoded.role,
        }
        next(); 
    } catch (error) {
        res.status(403).json({ error: "Invalid or Expired Token" });
        return;
    }
};

// Admin Authorization Middleware
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction):void => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ error: "Forbidden: Admins only" });
        return 
    }
    next();
};