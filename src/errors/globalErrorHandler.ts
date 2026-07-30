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
    sendResponse(res, {
      code: statusCode,
      message: message,
      errorDetails: errors,
    });
  }
  if (error instanceof AppError) {
    console.log(error)
    return sendResponse(res, {
      code: error.statusCode,
      message: error.message,
      errorDetails: error.errorDetails,
    });
  }
  
  sendResponse(res, {
    code: 500,
    message: "Something went wrong",
  });
};
export default globalErrorHandler;
