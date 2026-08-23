import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import { createProblem } from "../controllers/DSAController.js";

const router = express.Router();

router.post("/add", isLoggedIn, createProblem);

export default router;
