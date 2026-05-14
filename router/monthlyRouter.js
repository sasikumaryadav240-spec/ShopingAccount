import express from "express";


export const montlyRouter = express.Router();

import { monthlyHistory } from "../GlobalLogic/monthlyLogic.js";

montlyRouter.get("/monthlyHistory", monthlyHistory);