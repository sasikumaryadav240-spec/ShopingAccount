import express from "express";

export const salesLogicRouter = express.Router();

import { monthlyDashBoardLogic, monthlyProductLogic } from "../GlobalLogic/dashBoardLogic.js";

salesLogicRouter.get("/monthlyDashBoard", monthlyDashBoardLogic);
salesLogicRouter.get("/productDashBoard", monthlyProductLogic);