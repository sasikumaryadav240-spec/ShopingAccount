import express from "express";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const productRouter = express.Router();

import { createProduct, updateProduct, deleteProduct, getProducts } from "../Controller/productContoller.js"

productRouter.post("/product", upload.single('image'), createProduct);
productRouter.put("/product/:id", upload.single('image'), updateProduct);
productRouter.delete("/product/:id", deleteProduct);
productRouter.get("/products", getProducts);