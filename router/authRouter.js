import express from "express";
import { signIn, loginIn, newrefreshToken } from "../Controller/Auth.js";

export const authRouter = express.Router();

authRouter.post("/signIn", signIn);
authRouter.post("/login", loginIn);
authRouter.post("/refreshToken", newrefreshToken);