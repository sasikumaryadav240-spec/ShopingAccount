import express from "express";

export const productRouter = express.Router();

import { createProduct, updateProduct, deleteProduct, getProducts } from "../Controller/productContoller.js"

productRouter.post("/product", createProduct);
productRouter.put("/product/:id", updateProduct);
productRouter.delete("/product/:id", deleteProduct);
productRouter.get("/products", getProducts);