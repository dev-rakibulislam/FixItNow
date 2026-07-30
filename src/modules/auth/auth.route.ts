import { Router } from "express";
import { authController } from "./auth.controller";
import { validateData } from "../../middleware/validator.middleware";
import { userLoginSchema, userRegisterSchema } from "./auth.validator";
import authMiddleware from "../../middleware/auth.middleware";
const router = Router();

router.post(
  "/register",
  validateData(userRegisterSchema),
  authController.registerUserController,
);

router.post(
  "/login",
  validateData(userLoginSchema),
  authController.loginUserController,
);

router.get("/me", authMiddleware, authController.getMeController);

export const authRouter = router;
