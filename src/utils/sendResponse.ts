import { Response } from "express";

interface ISendResponseParams {
  code: number;
  message: string;
  data?: any;
  metaData?: any;
  errorDetails?: any
}

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
