import express from "express";


export const authLogicRouter = express.Router();
import { newrefreshToken, changePassword } from "../GlobalLogic/authLogic.js";

authLogicRouter.put("/changepassword", changePassword);
authLogicRouter.post("/refreshToken", newrefreshToken);