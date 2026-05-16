import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            quantity: { type: Number, required: true },
            price: { type: Number, trim : true }
        }
    ],
    totalAmount: {
        type: Number,
        trim : true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash", "UPI"],
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Sale = mongoose.model("sales", saleSchema);
