import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import { setCookie } from "../../setCookie";

const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { result, accessToken, refreshToken } =
      await authService.registerUserInDb(req.body);

    setCookie(res, "accessToken", accessToken, { httpOnly: true, maxAge: 24 });
    setCookie(res, "refreshToken", refreshToken, { httpOnly: true, maxAge: 14 });

  

    // secure:process.env.NODE_ENV==="production",

    sendResponse(res, {
      code: 201,
      message: "User registered successfully",
      data: result,
    });
  },
);

export const authController = { registerUserController };
