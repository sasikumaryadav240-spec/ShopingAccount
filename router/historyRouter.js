import express from "express";

import { getCombinedMonthlyReport, historyLogic} from "../GlobalLogic/historyLogic.js";
export const historyRouter = express.Router();

historyRouter.get("/history", historyLogic);
historyRouter.get("/monthCombinedHistory", getCombinedMonthlyReport);
