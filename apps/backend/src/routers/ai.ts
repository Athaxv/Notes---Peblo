import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { AIController, aiErrorHandler } from "../controllers/ai";

const router = Router();

router.use(authMiddleware);

router.post("/:id/generate-summary", AIController.generate);
router.post("/:id/ai", AIController.generate);
router.get("/:id/ai-status", AIController.status);

router.use(aiErrorHandler);

export default router;
