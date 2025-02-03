import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔍 Login Attempt:", req.body);

    const { email, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ email });
    console.log("👤 Found User:", user);

    if (!user) {
      console.log("❌ User Not Found!");
      res.status(401).json({ error: "Invalid credentials - user not found" });
      return;
    }

    // Log stored and entered passwords
    console.log("🔑 Stored Hashed Password:", user.password);
    console.log("🔑 Entered Password:", password);

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does NOT match!");
      res
        .status(401)
        .json({ error: "Invalid credentials - incorrect password" });
      return;
    }

    // Ensure JWT_SECRET is set
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("❌ Server Misconfiguration: Missing JWT_SECRET");
      res
        .status(500)
        .json({ error: "Server misconfiguration: JWT_SECRET is missing" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "✅ Login successful", token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
