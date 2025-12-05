import express from "express";
import {
  createCompany,
  getCompany,
  getAllCompanies,
  updateCompany,
} from "./company.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createCompany);
router.get("/:id", authMiddleware, getCompany);
router.get("/", authMiddleware, getAllCompanies);
router.put("/:id", authMiddleware, updateCompany);

export default router;
