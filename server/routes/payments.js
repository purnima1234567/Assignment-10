import { Router } from "express";
import { getPayments, createPaymentIntent, confirmPayment } from "../controllers/paymentController.js";

const router = Router();

router.get("/", getPayments);
router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);

export default router;
