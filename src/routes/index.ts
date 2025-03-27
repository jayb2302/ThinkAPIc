import { Router, Request, Response } from "express";
import { startCron } from "../controllers/devToolsController";
import courseRoutes from "./courseRoutes";
import topicRoutes from "./topicRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import progressLogRoutes from "./progressLogRoutes";
import quizRoutes from "./quizRoutes";
import exerciseRoutes from "./exerciseRoutes";

const router: Router = Router();

// Base API route
router.get("/", (req: Request, res: Response) => {
    res.status(200).send({message: 'Welcome to the ThinkAPIc'});
});

// Dev Tools
router.get("/start-cron", startCron);

// Other routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/topics", topicRoutes);
router.use("/progress", progressLogRoutes);
router.use("/quizzes", quizRoutes);
router.use("/exercises", exerciseRoutes);

export default router;
