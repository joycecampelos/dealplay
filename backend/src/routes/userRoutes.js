import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Lista todos
router.get("/", authenticateToken, authorizeAdmin, userController.listUsers);

// Busca por id
router.get("/:id", authenticateToken, userController.getUser);

// Cria
router.post("/", userController.createUser);

// Atualiza
router.put("/:id", authenticateToken, userController.updateUser);

// Remove
router.delete("/:id", authenticateToken, authorizeAdmin, userController.deleteUser);

export default router;
