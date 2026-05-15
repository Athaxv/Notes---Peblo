import { Router } from "express";
import { ShareController } from "../controllers/share";
import { notesErrorHandler } from "../controllers/note";

const router = Router();

router.get("/:shareId", ShareController.getPublic);

router.use(notesErrorHandler);

export default router;
