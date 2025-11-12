import { Router } from "express";
import { authenticateToken, optionalAuth, authorizeAdmin } from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/", authenticateToken, authorizeAdmin, userController.listUsers);
router.get("/:id", authenticateToken, userController.getUser);
router.post("/", optionalAuth, userController.createUser);
router.put("/:id", authenticateToken, userController.updateUser);
router.delete("/:id", authenticateToken, authorizeAdmin, userController.deleteUser);

export default router;
