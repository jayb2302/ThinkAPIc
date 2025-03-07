import { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("❌ Error:", err);

  // Handle MongoDB duplicate key error (e.g. title already exists)
  if (err instanceof MongoServerError && err.code === 11000) {
    res
      .status(400)
      .json({ error: "A resource with this title already exists." });
    return;
  }

  // Handle any other errors
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  res.status(500).json({ error: message });
};
