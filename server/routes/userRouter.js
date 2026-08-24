import express from "express";
import {
  registerUser,
  getAllUsers,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/userController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/getAllUsers", getAllUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isLoggedIn, getCurrentUser);

export default router;
