import { Sale } from "../Models/sale.js";
import { Expense } from "../Models/expense.js";
import mongoose from "mongoose";

export const monthlyDashBoardLogic= async (req, res) => {
    try {
        const userId = req.user.userId;
        const startOfDate = new Date();
        startOfDate.getMonth();
        startOfDate.setDate(1);
        startOfDate.setHours(0,0,0,0)

        const start = new Date();
        start.setHours(0,0,0,0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayMetrics = await Sale.aggregate([
            {
                $match:{
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : start,
                        $lte : endOfToday
                    }
                }
            },
            {
                $group : {
                    _id : null,
                    totalSales : { $sum : 1 },
                    totalRevenue : { $sum: "$totalAmount" }
                }
            }
        ]);

        const todayData = todayMetrics[0] || { totalSales : 0, totalRevenue : 0 };

        const metrics = await Sale.aggregate([
            {
                $match:{
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfDate,
                        $lte : endOfToday
                    }
                }
            },
            {
                $group : {
                    _id : null,
                    totalSales : { $sum : 1 },
                    totalRevenue : { $sum: "$totalAmount" }
                }
            }
        ]);

        const expenseMetrics = await Expense.aggregate([
            {
                $match:{
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfDate,
                        $lte : endOfToday
                    }
                }
            },
            {
                $group : {
                    _id : null,
                    totalExpense : { $sum : 1 },
                    totalExpenseAmount : { $sum : {$multiply : [ "$price" , "$quantity" ]} }
                }
            }
        ]);

        const currentMonthData = metrics[0] || { totalSales : 0, totalRevenue : 0 };

        const currentMonthExpense = expenseMetrics[0] || { totalExpense : 0, totalExpenseAmount : 0 }

        res.status(200).json({
            status : "Success",
            dailySales : {
                totalSales : todayData.totalSales,
                totalRevenue : todayData.totalRevenue
            },
            monthSales : {
                totalSales : currentMonthData.totalSales,
                totalRevenue : currentMonthData.totalRevenue
            },
            monthExpense : {
                totalExpenses : currentMonthExpense.totalExpense,
                totalAmount : currentMonthExpense.totalExpenseAmount
            }
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const monthlyProductLogic = async (req, res) => {
    try {
        const userId = req.user.userId;
        const startOfDate = new Date();
        startOfDate.setHours(0,0,0,0)

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const metrics = await Sale.aggregate([
            {
                $match:{
                    userId : new mongoose.Types.ObjectId(userId),
                    createdAt : {
                        $gte : startOfDate,
                        $lte : endOfToday
                    }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $group : {
                    _id : "$products.productId",
                    productSales : { $sum : "$products.quantity" },
                    productRevenue : { $sum: "$products.price" }
                }
            },
            {
                $lookup : {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind : "$productDetails"
            },
            {
                $project : {
                    _id : 1,
                    productName : "$productDetails.name",
                    noOfSales : "$productSales",
                    totalSalesAmount : "$productRevenue"
                }
            },
            {
                $sort : { noOfSales : -1}
            }
        ]);

        res.status(200).json({
            status : "Success",
            metrics
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}