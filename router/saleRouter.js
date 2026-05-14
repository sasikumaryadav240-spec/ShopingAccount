import express from "express";


export const saleRouter = express.Router();

import { createSale, deleteSale, getSales } from "../Controller/salesController.js";

saleRouter.post("/sales",createSale);
saleRouter.delete("/sales/:id", deleteSale);
saleRouter.get("/sales", getSales);