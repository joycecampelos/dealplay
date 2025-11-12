import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import * as itadController from "../controllers/itadController.js";

const router = Router();

router.get("/deals/best", authenticateToken, itadController.listBestDeals);
router.get("/games/popular", authenticateToken, itadController.listPopularGames);
router.get("/games/search", authenticateToken, itadController.searchGamesByName);
router.get("/games/details", authenticateToken, itadController.getGameAllDetailsById);

export default router;
