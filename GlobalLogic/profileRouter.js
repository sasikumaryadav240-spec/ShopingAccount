import { Expense } from "../Models/expense.js";
import { Product } from "../Models/product.js";
import { Sale } from "../Models/sale.js";
import { User } from "../Models/user.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userDetails = await User.findById(userId).select("-password");

        if(!userDetails) return res.status(404).json("Profile Not Found");

        res.status(200).json({
            status : "success",
            user : userDetails
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { email,name, shopName } = req.body;

        const userDetails = await User.findOneAndUpdate(
            userId,
            {
                email,
                name,
                shopName
            },
            { new : true, runValidators: true  }
        ).select("-password");

        if(!userDetails) return res.status(404).json("Profile Not Found");

        res.status(200).json({
            status : "success",
            user : userDetails
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Sale.deleteMany({ userId: userId });
        await Product.deleteMany({ userId: userId });
        await Expense.deleteMany({ userId: userId });

        const userDetails = await User.findByIdAndDelete(userId);

        if(!userDetails) return res.status(404).json("Profile Not Found");

        res.status(200).json({
            status : "success",
            message: "Account and all associated business data permanently deleted."
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}