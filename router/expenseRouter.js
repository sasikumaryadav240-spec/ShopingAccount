import express from "express";

export const expenseRouter = express.Router();

import { createExpense, updateExpense, deleteExpense, getExpenses } from "../Controller/expenseController.js";

expenseRouter.post("/expense", createExpense);
expenseRouter.put("/expense/:id", updateExpense);
expenseRouter.delete("/expense/:id", deleteExpense);
expenseRouter.get("/expense", getExpenses);