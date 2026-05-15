import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { InsightsController } from "../controllers/insights";

const router = Router();

router.use(authMiddleware);
router.get("/", InsightsController.get);

export default router;
