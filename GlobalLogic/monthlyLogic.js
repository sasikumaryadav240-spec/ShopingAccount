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

export const fullYearHistoy = async (req, res) => {
    try {
        const userId = req.user.userId;
        const startOfDate = new Date();
        startOfDate.setMonth(startOfDate.getMonth() - 11);
        startOfDate.setHours(0,0,0,0);

        const endOfData = new Date();
        endOfData.setHours(23,59,59,999);

        const default12Months = [];
        let currentLoopDate = new Date(startOfDate);

        while (currentLoopDate <= endOfData) {
            default12Months.push({
                year: currentLoopDate.getFullYear(),
                month: currentLoopDate.getMonth() + 1,
                noOfSales: 0,
                totalRevenue: 0
            });
            currentLoopDate.setDate(1);
            currentLoopDate.setMonth(currentLoopDate.getMonth() + 1);
        }

        const yearMetrics = await Sale.aggregate([
            {
                $match : {
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfDate,
                        $lte : endOfData
                    }
                }
            },
            {
                $project : {
                    year : { $year : "$createdAt" },
                    month : { $month : "$createdAt" },
                    totalAmount : 1
                }
            },
            {
                $group : {
                    _id : {
                        year : "$year",
                        month : "$month"
                    },
                    noOfSales : { $sum : 1 },
                    totalRevenue : { $sum : "$totalAmount" }
                }
            }
        ]);

        const finalizedHistory = default12Months.map((defaultMonth) => {
            const realDataMatch = yearMetrics.find(
                (dbRecord) => dbRecord._id.year === defaultMonth.year && dbRecord._id.month === defaultMonth.month
            );

            return realDataMatch ? {
                year: defaultMonth.year,
                month: defaultMonth.month,
                noOfSales: realDataMatch.noOfSales,
                totalRevenue: realDataMatch.totalRevenue
            } : defaultMonth;
        });

        res.status(200).json({
            status: "success",
            yearMetrics: finalizedHistory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const monthTopProducts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const startOfDate = new Date();
        startOfDate.setDate(1);
        startOfDate.setHours(0,0,0,0);

        const endOfDate = new Date();
        endOfDate.setHours(23,59,59,999);

        const topSales = await Sale.aggregate([
            {
                $match : {
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfDate,
                        $lte : endOfDate
                    }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $group : {
                    _id : "$products.productId",
                    productName : { $first : "$products.name"},
                    totalSales : { $sum : "$products.quantity" },
                    totalAmount : { $sum :  "$products.price" }
                }
            },
            {
                $sort : {
                    totalSales : -1
                }
            },
            {
                $project : {
                    _id : 1,
                    productName : 1,
                    totalSales : 1,
                    totalAmount : 1
                }
            }
        ]);

        res.status(200).json({
            status: "success",
            metrics: topSales
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}