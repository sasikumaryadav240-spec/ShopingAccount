import { mongoose } from "mongoose";

const expenseModel = new mongoose.Schema({
    userId : {
        required : true,
        ref : "users",
        type : mongoose.Schema.Types.ObjectId,
    },
    expenseName : {
        required : true,
        type : String,
        trim: true
    },
    price : {
        required : true,
        type : Number,
        trim : true
    },
    quantity : {
        required : true,
        type : Number,
        trim : true
    },
    note : {
        required : true,
        type : String,
        trim: true,
        minlength :5,
        maxlength : 1000
    },
},{
    timestamps : true,
    versionKey : false
});

export const Expense = mongoose.model("expenses", expenseModel);