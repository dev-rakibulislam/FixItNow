import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await authService.registerUserInDb(req.body)
      sendResponse(res, {
      code: 201,
      message: "User registered successfully",
      data: data,
    });
  },
);

export const authController = { registerUserController };
