import { Expense } from "../Models/expense.js"

export const createExpense = async (req, res) => {
    try {
        const { expenseName, price, note, quantity } = req.body;
        const userId = req.user.userId;

        const expense = await Expense.create({
            userId,
            expenseName,
            price,
            note,
            quantity
        });

        if(!expense) return res.status(400).json({
            status : "failed",
            message : "Expense Create Failed"
        });

        res.status(201).json({
            status: "success",
            expense
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.userId;

        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, userId: userId },
            req.body,
            { new : true, runValidators: true}
        );

        if(!expense) return res.status(400).json({
            status : "failed",
            message : "Product Expense Failed"
        });

        res.status(200).json({
            status: "success",
            expense
        });
    } catch (error) {
         res.status(500).json({ status: "error", message: error.message });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if(!expense) return res.status(400).json({
            status : "failed",
            message : "Expense Delete Failed"
        });

        res.status(200).json({
            expense
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const expense = await Expense.find({
            userId
        });

        if(!expense) return res.status(400).json({
            status : "failed",
            message : "Expense Delete Failed"
        });

        res.status(200).json({
            expense
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}