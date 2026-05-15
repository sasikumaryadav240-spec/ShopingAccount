import express from "express";


export const montlyRouter = express.Router();

import { monthlyHistory, fullYearHistoy, monthTopProducts } from "../GlobalLogic/monthlyLogic.js";

montlyRouter.get("/monthlyHistory", monthlyHistory);
montlyRouter.get("/fullYearHistory", fullYearHistoy);
montlyRouter.get("/topSalesOfTheMonth", monthTopProducts);