import express from "express";
import { signIn, loginIn } from "../Controller/Auth.js";

export const authRouter = express.Router();

authRouter.post("/signIn", signIn);
authRouter.post("/login", loginIn);