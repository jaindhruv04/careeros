import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import {
  createEntry,
  getAllEntries,
  getEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/", isLoggedIn, createEntry);
router.get("/", isLoggedIn, getAllEntries);
router.get("/:id", isLoggedIn, getEntry);
router.patch("/:id", isLoggedIn, updateEntry);
router.delete("/:id", isLoggedIn, deleteEntry);

export default router;
