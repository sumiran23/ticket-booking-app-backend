import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/customRequest";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as string | undefined;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const accessToken = authHeader.split(" ")[1];
  let decodedToken: JwtPayload | null = null;

  try {
    decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as CustomRequest).user = {
    userId: decodedToken.id,
    email: decodedToken.email,
  };

  next();
};
