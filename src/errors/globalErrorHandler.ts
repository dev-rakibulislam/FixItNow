import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import handleZodError from "./handleZodError";
import { sendResponse } from "../utils/sendResponse";
import AppError from "./AppError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

  sendResponse(res, {
    code: 500,
    errorDetails: error,
    message: "Something went wrong",
  });
};
export default globalErrorHandler;
