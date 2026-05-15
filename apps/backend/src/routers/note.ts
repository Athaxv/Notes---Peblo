import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import { NotesController, notesErrorHandler } from "../controllers/note";
import {
  createNoteSchema,
  listNotesQuerySchema,
  updateNoteSchema,
} from "../schemas/note.schema";

const router = Router();

router.use(authMiddleware);

router.get("/", validateQuery(listNotesQuerySchema), NotesController.list);
router.post("/", validateBody(createNoteSchema), NotesController.create);
router.get("/:id", NotesController.getOne);
router.patch("/:id", validateBody(updateNoteSchema), NotesController.update);
router.delete("/:id", NotesController.remove);

router.use(notesErrorHandler);

export default router;
