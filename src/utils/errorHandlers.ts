import { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("❌ Error:", err);

  // Handle MongoDB duplicate key error 
  if (err instanceof MongoServerError && err.code === 11000) {
    res
      .status(400)
      .json({ error: "A resource with this title already exists." });
    return;
  }

   // Handle custom error for course creation
   if (err.message === "A course with this title already exists.") {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message === "A topic with this title already exists in the database.") {
    res.status(400).json({ error: err.message });
    return;
  }

  const statusCode = err.status ?? 500; 
  res.status(statusCode).json({ error: err.message || "An unexpected error occurred" });
};
