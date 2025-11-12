import { Router } from "express";
import { authenticateToken, authorizeAdmin } from "../middlewares/authMiddleware.js";
import * as gameController from "../controllers/gameController.js";

const router = Router();

router.get("/", authenticateToken, authorizeAdmin, gameController.listGames);
router.get("/:id", authenticateToken, authorizeAdmin, gameController.getGame);
router.get("/itad/:id_itad", authenticateToken, gameController.getGameByIdItad);
router.post("/", authenticateToken, gameController.createGame);
router.put("/:id", authenticateToken, authorizeAdmin, gameController.updateGame);
router.delete("/:id", authenticateToken, authorizeAdmin, gameController.deleteGame);

export default router;
