import { Router } from "express";
import { getUsers, updateUserStatus, deleteUser } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

export default router;
