import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import {
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/DSAController.js";

const router = express.Router();

router.post("/", isLoggedIn, createProblem);
router.get("/", isLoggedIn, getAllProblems);
router.get("/:id", isLoggedIn, getProblem);
router.patch("/:id", isLoggedIn, updateProblem);
router.delete("/:id", isLoggedIn, deleteProblem);

export default router;
