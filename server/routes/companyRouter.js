import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

const router = express.Router();

router.post("/", isLoggedIn, createCompany);
router.get("/", isLoggedIn, getAllCompanies);
router.get("/:id", isLoggedIn, getCompany);
router.patch("/:id", isLoggedIn, updateCompany);
router.delete("/:id", isLoggedIn, deleteCompany);

export default router;
