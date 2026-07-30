import express from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./errors/globalErrorHandler";

const app = express();

app.use(express.json());
// app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/auth", authRouter);
app.use(globalErrorHandler)

export default app;
