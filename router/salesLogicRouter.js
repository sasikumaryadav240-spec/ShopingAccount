import express from "express";

export const salesLogicRouter = express.Router();

import { monthlyDashBoardLogic, monthlyProductLogic, dailyDashBoardLogic } from "../GlobalLogic/dashBoardLogic.js";

salesLogicRouter.get("/dailyDashBoard", dailyDashBoardLogic);
salesLogicRouter.get("/monthlyDashBoard", monthlyDashBoardLogic);
salesLogicRouter.get("/productDashBoard", monthlyProductLogic);