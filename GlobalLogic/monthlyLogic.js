import { Expense } from "../Models/expense.js";
import { Sale } from "../Models/sale.js";
import { User } from "../Models/user.js";
import mongoose from "mongoose";

export const monthlyHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        const startOfData = userDetails.createdAt;
        const endOfData = new Date();
        endOfData.getMonth() - 1 ;
        
        const matric = await Sale.aggregate([
            {
                $match : {
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfData,
                        $lte : endOfData
                    }
                }
            },
            {
                $group : {
                    _id : {
                        year : { $year : "$createdAt" },
                        month : { $month : "$createdAt" }
                    },
                    totalSales : { $sum : 1 },
                    totalAmount : { $sum : "$totalAmount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            },
            {
                $project : {
                    _id : 0,
                    year : "$_id.year",
                    month : "$_id.month",
                    totalSales : 1,
                    totalAmount : 1
                }
            }
        ]);

        const expenseMatric = await Expense.aggregate([
            {
                $match : {
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfData,
                        $lte : endOfData
                    }
                }
            },
            {
                $group : {
                    _id : {
                        year : { $year : "$createdAt" },
                        month : { $month : "$createdAt" }
                    },
                    totalExpense : { $sum : {$multiply : [ "$price" , "$quantity" ]} }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            },
            {
                $project : {
                    _id : 0,
                    year : "$_id.year",
                    month : "$_id.month",
                    totalExpense : 1
                }
            }
        ]);

        const combinedHistory = matric.map(saleItem => {
            const matchingExpense = expenseMatric.find(
                expItem => expItem.year === saleItem.year && expItem.month === saleItem.month
            );

            return {
                year: saleItem.year,
                month: saleItem.month,
                noOfSales: saleItem.totalSales,
                totalRevenue: saleItem.totalAmount,
                totalExpense: matchingExpense ? matchingExpense.totalExpense : 0
            };
        });

        expenseMatric.forEach(expItem => {
            const alreadyAdded = combinedHistory.some(
                combItem => combItem.year === expItem.year && combItem.month === expItem.month
            );

            if (!alreadyAdded) {
                combinedHistory.push({
                    year: expItem.year,
                    month: expItem.month,
                    noOfSales: 0,
                    totalRevenue: 0,
                    totalExpense: expItem.totalExpense
                });
            }
        });

        combinedHistory.sort((a, b) => a.year - b.year || a.month - b.month);

        res.status(200).json({
            status : "success",
            combinedHistory
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}