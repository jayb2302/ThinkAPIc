import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auth Routes are working!");
});

router.post("/register", register);
router.post("/login", login);

export default router;