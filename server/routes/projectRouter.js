import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", isLoggedIn, createProject);
router.get("/", isLoggedIn, getAllProjects);
router.get("/:id", isLoggedIn, getProject);
router.patch("/:id", isLoggedIn, updateProject);
router.delete("/:id", isLoggedIn, deleteProject);

export default router;
