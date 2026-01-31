import { Request, Response, NextFunction } from "express";
import authService from "../service/auth";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await authService.register(email, password);

    const { refreshToken } = user;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
      // sameSite: "none",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    const { refreshToken } = user;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
      // sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("refreshToken", { httpOnly: true });
    res.status(204).json({});
  } catch (error) {
    console.log(error);
    res.clearCookie("refreshToken", { httpOnly: true });
    next();
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const user = await authService.refreshToken(refreshToken);

    const { refreshToken: newRefreshToken } = user;

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
      // sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
