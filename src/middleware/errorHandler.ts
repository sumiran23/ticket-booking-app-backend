import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "An error occured. Please try again later."
      : err.message;
  console.log(err);
  res.status(statusCode).json({ message, errorData: err.data || null });
};

export default errorHandlerMiddleware;
