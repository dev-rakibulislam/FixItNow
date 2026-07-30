import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import handleZodError from "./handleZodError";
import { sendResponse } from "../utils/sendResponse";
import AppError from "./AppError";
import { handlePrismaError } from "./handlePrismaError";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import config from "../config";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  config.node_env === "DEVELOPMENT" && console.error(error);
  if (error instanceof ZodError) {
    const { statusCode, errors, message } = handleZodError(error);
    return sendResponse(res, {
      code: statusCode,
      message: message,
      errorDetails: errors,
    });
  }
  
  if (error instanceof AppError) {
    return sendResponse(res, {
      code: error.statusCode,
      message: error.message,
      errorDetails: error?.errorDetails,
    });
  }

  if (error.type === "entity.parse.failed") {
    return sendResponse(res, {
      code: error.statusCode,
      message: error.message,
      errorDetails: "Invalid JSON format",
    });
  }

  if(error instanceof PrismaClientKnownRequestError){
    const simplifiedError=handlePrismaError(error)

    return sendResponse(res,{
        code:simplifiedError.statusCode,
        message:simplifiedError.message,
        errorDetails:simplifiedError.errors
    })
}

  if (error instanceof PrismaClientValidationError) {
    return sendResponse(res, {
      code: 400,
      message: "Database validation error",
    });
  }

  sendResponse(res, {
    code: 500,
    errorDetails: error,
    message: "Something went wrong",
  });
};
export default globalErrorHandler;
