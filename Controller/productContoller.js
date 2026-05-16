import { Product } from "../Models/product.js";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const userId = req.user.userId;

        let imagePath = "https://cloudinary.com"; 

        if (req.file) {
            const fileBase64 = req.file.buffer.toString('base64');
            const fileUrl = `data:${req.file.mimetype};base64,${fileBase64}`;

            const uploadResult = await cloudinary.uploader.upload(fileUrl, {
                folder: 'products',
            });
            
            imagePath = uploadResult.secure_url;
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
        let updateData = { ...req.body };

        if (req.file) {
            const fileBase64 = req.file.buffer.toString('base64');
            const fileUrl = `data:${req.file.mimetype};base64,${fileBase64}`;

            const uploadResult = await cloudinary.uploader.upload(fileUrl, {
                folder: 'products',
            });
            
            updateData.image = uploadResult.secure_url;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
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
        
        const productData = await Product.findOne({ _id: productId, userId: userId });
        if(!productData) return res.status(400).json({ status : "failed", message : "Product Not Found" });

        if (productData.image && productData.image.includes('cloudinary')) {
            const urlParts = productData.image.split('/');
            const fileName = urlParts[urlParts.length - 1].split('.')[0];
            const folderName = urlParts[urlParts.length - 2];
            await cloudinary.uploader.destroy(`${folderName}/${fileName}`);
        }

        const product = await Product.findOneAndDelete({ _id : productId, userId : userId });

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
            message : "Product Fetch Failed"
        });

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}
