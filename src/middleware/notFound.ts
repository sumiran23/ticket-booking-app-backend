import { Request, Response } from "express";

const notFoundMiddleware = async (req: Request, res: Response) =>
  res.status(404).json({ message: "Route not found." });

export default notFoundMiddleware;
