import mongoose from "mongoose";

const productModel = new mongoose.Schema({
    userId : {
        required : true,
        ref : "users",
        type : mongoose.Schema.Types.ObjectId,
    },
    name : {
        required : true,
        type : String,
        trim: true
    },
    price : {
        required : true,
        type : Number
    },
    quantity : {
        required : true,
        type : Number,
    },
    image : {
        type : String,
        required : false,
        default : "https://res.cloudinary.com/diyierfkp/image/upload/f_auto,q_auto/Main_small_shop_image_dxguyw"
    }
},{
    timestamps : true,
    versionKey : false
});

export const Product = mongoose.model("products", productModel);