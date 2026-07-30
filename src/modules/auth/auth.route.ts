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
// router.post("/register", authController.registerUserController);
export const authRouter = router;
