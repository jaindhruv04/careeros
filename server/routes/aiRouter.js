import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/chat", isLoggedIn, chatWithAI);

export default router;
