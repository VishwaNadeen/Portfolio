import express from "express";
import {
  getAdminHealth,
  getAdminStats,
} from "../controllers/adminDashboardController";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.get("/health", adminAuth, getAdminHealth);
router.get("/stats", adminAuth, getAdminStats);

export default router;