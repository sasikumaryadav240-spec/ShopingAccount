import mongoose from "mongoose";
import { Sale } from "../Models/sale.js";
import { Expense } from "../Models/expense.js";

export const historyLogic = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [sales, expenses] = await Promise.all([
            Sale.find({ userId }).lean(),
            Expense.find({ userId }).lean()
        ]);

        const formattedSales = sales.map(sale => ({
            _id: sale._id,
            type: "sale",
            title: "Client Checkout Receipt",
            amount: sale.totalAmount,
            paymentMode: sale.paymentMethod,
            products: sale.products,
            createdAt: sale.createdAt
        }));

        const formattedExpenses = expenses.map(exp => ({
            _id: exp._id,
            type: "expense",
            title: exp.expenseName,
            amount: exp.price * exp.quantity,
            paymentMode: exp.paymentMode || "Cash",
            quantity: exp.quantity,
            note: exp.note,
            createdAt: exp.createdAt
        }));

        const combinedTimeline = [...formattedSales, ...formattedExpenses];

        combinedTimeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.status(200).json({
            status: "Success",
            timelineCount: combinedTimeline.length,
            timeline: combinedTimeline
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getCombinedMonthlyReport = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ 
                status: "failed", 
                message: "Please provide both month and year parameters." 
            });
        }

        const targetMonth = parseInt(month, 10); 
        const targetYear = parseInt(year, 10);

        const startOfData = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 0, 0, 0, 0));
        const endOfData = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));

        const [sales, expenses] = await Promise.all([
            Sale.find({
                userId,
                createdAt: { $gte: startOfData, $lte: endOfData }
            }).lean(),
            Expense.find({
                userId,
                createdAt: { $gte: startOfData, $lte: endOfData }
            }).lean()
        ]);

        const formattedSales = sales.map(sale => ({
            _id: sale._id,
            type: "sale",
            title: "Client Checkout Receipt",
            amount: sale.totalAmount,
            paymentMode: sale.paymentMethod,
            products: sale.products, 
            createdAt: sale.createdAt
        }));

        const formattedExpenses = expenses.map(exp => ({
            _id: exp._id,
            type: "expense",
            title: exp.title || exp.expenseName, 
            amount: exp.price * exp.quantity, 
            paymentMode: exp.paymentMode || "Cash",
            quantity: exp.quantity,
            note: exp.note,
            createdAt: exp.createdAt
        }));

        const combinedTimeline = [...formattedSales, ...formattedExpenses];

        combinedTimeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const totalSalesRevenue = sales.reduce((sum, item) => sum + item.totalAmount, 0);
        const totalExpensesCost = expenses.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.status(200).json({
            status: "Success",
            selectedPeriod: {
                month: targetMonth,
                year: targetYear
            },
            summary: {
                totalRevenue: totalSalesRevenue,
                totalExpensesAmount: totalExpensesCost,
                netProfit: totalSalesRevenue - totalExpensesCost
            },
            timeline: combinedTimeline
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
