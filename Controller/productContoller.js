import { Product } from "../Models/product.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const userId = req.user.userId;

        let imagePath = "default-product.jpg";
        if (req.file) {
            imagePath = `images/${req.file.filename}`;
        }

        const product = await Product.create({
            userId,
            name,
            price,
            quantity,
            image : imagePath
        });

        if(!product) return res.status(400).json({
            status : "failed",
            message : "Product Create Failed"
        });

        res.status(201).json({
            status: "success",
            product
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new : true }
        );

        if(!product) return res.status(400).json({
            status : "failed",
            message : "Product Update Failed"
        });

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.id;
        const product = await Product.findOneAndDelete(
            { 
                _id : productId,
                userId : userId
            }
        );

        if(!product) return res.status(400).json({
            status : "failed",
            message : "Product Delete Failed"
        });

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getProducts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const product = await Product.find({
            userId
        });

        if(!product) return res.status(400).json({
            status : "failed",
            message : "Product Delete Failed"
        });

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}