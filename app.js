import express from "express";
import dotenv from "dotenv";
import 'dotenv/config';
import cors from "cors";
import { mongoDB } from "./database/db.js";
import { authRouter } from "./router/authRouter.js";
import { productRouter } from "./router/productRouter.js";
import { verifyToken } from "./MiddleWare/authMiddleWare.js";
import { expenseRouter } from "./router/expenseRouter.js";
import { saleRouter } from "./router/saleRouter.js";
import { salesLogicRouter } from "./router/salesLogicRouter.js";
import { montlyRouter } from "./router/monthlyRouter.js";
import { profileRouter } from "./router/profileRouter.js";

mongoDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", verifyToken, productRouter);
app.use("/api", verifyToken, expenseRouter);
app.use("/api", verifyToken, saleRouter);
app.use("/api", verifyToken, salesLogicRouter);
app.use("/api", verifyToken, montlyRouter);
app.use("/api", verifyToken, profileRouter);

app.listen(5000);