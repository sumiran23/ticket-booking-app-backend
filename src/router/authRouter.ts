import express from "express";
import { register, login, logout, refreshToken } from "../controller/auth";
import { verifyJWT } from "../middleware/jwt";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.post("/logout", verifyJWT, logout);

authRouter.post("/refresh-token", refreshToken);

export default authRouter;
