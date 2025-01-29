import { Router, Request, Response } from "express";
import courseRoutes from "./courseRoutes";
import topicRoutes from "./topicRoutes";

const router: Router = Router();

// Get, Post, Put, Delete (CRUD)

// Base API route
router.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the ThinkAPIc");
});

// Other routes
router.use("/courses", courseRoutes);
router.use("/topics", topicRoutes);


export default router;
