import { Product } from "../Models/product.js";
import { Sale } from "../Models/sale.js";

export const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;
        const userId = req.user.userId;

        if(!items || !items.length === 0) {
            return res.status(400).json("Itmes can't be Empty!");
        }

        let totalAmount = 0;
        const products = [];

        for( const item of items){
            const productDoc = await Product.findById(item.productId);

            if (!productDoc) {
                return res.status(404).json({ 
                    status: "failed", 
                    message: `Product with ID ${item.productId} does not exist.` 
                });
            }

            const totalItemAmount = productDoc.price * item.quantity;
            totalAmount += totalItemAmount;
            
            products.push({
                productId : productDoc._id,
                quantity : item.quantity,
                price : totalItemAmount
            });
        }

        const newSale = await Sale.create({
            userId : userId,
            products : products,
            totalAmount : totalAmount,
            paymentMethod : paymentMethod
        });

        res.status(201).json({
            status : "success",
            message : "Items Sale Created",
            data : products
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const deleteSale = async (req, res) => {
    const userId = req.user.userId;

    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);

        if(!sale) return res.status(400).json({
            status : "failed",
            message : "Sale Delete Failed"
        });

        res.status(200).json({
            status : "success",
            message : "Sale Successfully Deleted"
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getSales = async (req, res) => {
    const userId = req.user.userId;

    try {
        const sale = await Sale.findOne({ userId });

        if(!sale) return res.status(404).json({
            status : "failed",
            message : "No sales Found"
        });

        res.status(200).json({
            sale
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}