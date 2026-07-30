import { Router } from "express";
import { authController } from "./auth.controller";
import { validateData } from "../../middleware/validator.middleware";
import { userRegisterSchema } from "./auth.validator";
const router = Router();

router.post(
  "/register",
  validateData(userRegisterSchema),
  authController.registerUserController,
);
router.post("/login", authController.loginUserController);
export const authRouter = router;
