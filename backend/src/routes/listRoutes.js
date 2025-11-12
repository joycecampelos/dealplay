import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import * as listController from "../controllers/listController.js";

const router = Router();

router.get("/", authenticateToken, listController.listAllLists);
router.get("/:id", authenticateToken, listController.getListById);
router.get("/game/:game_id", authenticateToken, listController.getListsByGame);
router.get("/user/:user_id/game/:id_itad", authenticateToken, listController.getListByUserAndGame);
router.post("/", authenticateToken, listController.createList);
router.put("/:id", authenticateToken, listController.updateList);
router.delete("/:id", authenticateToken, listController.deleteList);

export default router;
