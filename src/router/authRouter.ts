import express from "express";
import { register, login, logout } from "../controller/auth";
import { verifyJWT } from "../middleware/jwt";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.post("/logout", verifyJWT, logout);

export default authRouter;
