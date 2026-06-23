import { Router } from "express";
import { getReviews, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";

const router = Router();

router.get("/", getReviews);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
