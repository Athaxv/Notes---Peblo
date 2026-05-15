import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { AIController, aiErrorHandler } from "../controllers/ai";

const router = Router();

router.use(authMiddleware);

router.post("/:id/ai", AIController.generate);

router.use(aiErrorHandler);

export default router;
