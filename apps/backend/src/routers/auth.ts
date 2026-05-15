import { Router } from "express";
import { authController, authErrorHandler } from "../controllers/auth";
import { validateBody } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.use(authErrorHandler);

export default router;
