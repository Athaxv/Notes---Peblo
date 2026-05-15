import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { NotesController, notesErrorHandler } from "../controllers/note";

const router = Router();

router.use(authMiddleware);

router.post("/", NotesController.create);
router.get("/", NotesController.list);
router.get("/:id", NotesController.getOne);
router.patch("/:id", NotesController.update);
router.delete("/:id", NotesController.remove);

router.use(notesErrorHandler);

export default router;
