import { Response } from "express";
import { ISendResponseParams } from "../types/sendResponse";


export const sendResponse = (
  res: Response,
  { code, message, data, metaData, errorDetails }: ISendResponseParams,
) => {
  return res.status(code).json({
    success: code >= 200 && code < 300,
    message,
    data,
    metaData,
    errorDetails,
  });
};
