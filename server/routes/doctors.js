import { Router } from "express";
import { getDoctors, verifyDoctor } from "../controllers/doctorController.js";

const router = Router();

router.get("/", getDoctors);
router.patch("/:id/verify", verifyDoctor);

export default router;
