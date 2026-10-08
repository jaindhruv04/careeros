import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import { getUserAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/", isLoggedIn, getUserAnalytics);

export default router;
