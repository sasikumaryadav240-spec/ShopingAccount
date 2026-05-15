import express from "express";
import { signIn, loginIn, newrefreshToken, changePassword } from "../Controller/Auth.js";

export const authRouter = express.Router();

authRouter.post("/signIn", signIn);
authRouter.post("/login", loginIn);
authRouter.put("/changePassword", changePassword);
authRouter.post("/refreshToken", newrefreshToken);