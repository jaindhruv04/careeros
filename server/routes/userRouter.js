import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/userController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isLoggedIn, getCurrentUser);

export default router;
