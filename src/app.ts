import express from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./errors/globalErrorHandler";
import AppError from "./errors/AppError";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/auth", authRouter);

app.use((req, res, next) => {
  next(new AppError(404, `Cannot ${req.method} ${req.originalUrl}. maybe this does not exist or you are not authorized to access this route`));
});

app.use(globalErrorHandler)

export default app;
