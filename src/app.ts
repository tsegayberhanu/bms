import express from "express";
import type { Request, Response } from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", async (_req: Request, res: Response) => {
  res.json({
    status:"success",
    message:"server running healthy"
  })
});

export default app;
