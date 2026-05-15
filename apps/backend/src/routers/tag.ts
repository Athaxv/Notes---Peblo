import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { TagRepository } from "../repositories/tag";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tags = await TagRepository.findManyForUser(req.userId);
    return res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
});

export default router;
