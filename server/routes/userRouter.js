import express from "express";
import {
  registerUser,
  getAllUsers,
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/getAllUsers", getAllUsers);
router.post("/login", loginUser);

export default router;
