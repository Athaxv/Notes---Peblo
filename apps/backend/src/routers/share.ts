import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { ShareController } from "../controllers/share";
import { notesErrorHandler } from "../controllers/note";

const router = Router();

router.use(authMiddleware);

router.post("/:id/share", ShareController.enable);
router.delete("/:id/share", ShareController.disable);

router.use(notesErrorHandler);

export default router;
