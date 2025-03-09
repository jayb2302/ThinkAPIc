import express from "express";
import { getUsers, getUserById, createUser, updateUserRole, updateUserProfile, deleteUser } from "../controllers/userController";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
const router = express.Router();

// Admin routes
router.get("/", authenticateUser, authorizeAdmin, getUsers);
router.get("/:id", authenticateUser, authorizeAdmin, getUserById);
router.post("/", authenticateUser, authorizeAdmin, createUser);
router.put("/:id/role", authenticateUser, authorizeAdmin, updateUserRole);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteUser);

// User Routes
router.put("/:id", authenticateUser, updateUserProfile);

export default router;