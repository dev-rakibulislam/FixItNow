import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import { setCookie } from "../../setCookie";
import config from "../../config";

const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { result, accessToken, refreshToken } =
      await authService.registerUserInDb(req.body);

    setCookie(res, "accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24,
      secure: config.node_env === "production",
    });

    setCookie(res, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      maxAge: 14,
    });

    sendResponse(res, {
      code: 201,
      message: "User registered successfully",
      data: result,
    });
  },
);

const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const { result, accessToken, refreshToken } =
    await authService.loginUserFromDb(req.body);

  setCookie(res, "accessToken", accessToken, {
    httpOnly: true,
    maxAge: 24,
    secure: config.node_env === "production",
  });

  setCookie(res, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    maxAge: 14,
  });

  sendResponse(res, {
    code: 200,
    message: "User logged in successfully",
    data: result,
  });
});

export const authController = { registerUserController, loginUserController };
