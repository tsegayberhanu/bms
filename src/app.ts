import express from "express";
import type { Request, Response } from "express";
import { notFoundHandler } from "./shared/middlewares/index.js";
import { errorHandlerMiddleware } from "./shared/middlewares/index.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", async (_req: Request, res: Response) => {
  res.json({
    status:"success",
    message:"server running healthy"
  })
});

app.use(notFoundHandler);
app.use(errorHandlerMiddleware)
export default app;
