import { Router } from "express";
import { getPlatformStats, getAnalyticsData } from "../controllers/analyticsController.js";

const router = Router();

router.get("/stats", getPlatformStats);
router.get("/data", getAnalyticsData);

export default router;
