import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import { UserStatus } from "../../generated/prisma/enums";

const authMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader
      ? authorizationHeader.startsWith("Bearer ")
        ? authorizationHeader.split(" ")[1]
        : authorizationHeader
      : req.cookies.accessToken;

    if (!token) {
      return sendResponse(res, {
        code: 401,
        message: "Unauthorized",
      });
    }

    const decodedToken = verifyAccessToken(token, config.jwt_access_secret);

    const authenticatedUser = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!authenticatedUser) {
      throw new AppError(
        401,
        "Authentication failed! Please log in again to continue",
      );
    }
    
    if (authenticatedUser.status !== UserStatus.ACTIVE) {
      throw new AppError(403, "Account is not active. Please contact support.");
    }

    req.user = authenticatedUser;

    next();
  },
);

export default authMiddleware;
