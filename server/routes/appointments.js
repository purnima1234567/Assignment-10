import { Router } from "express";
import { getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from "../controllers/appointmentController.js";

const router = Router();

router.get("/", getAppointments);
router.post("/", createAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

export default router;
