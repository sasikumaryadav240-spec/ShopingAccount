import { mongoose } from "mongoose";
import bcrypt from "bcrypt";

const userModel = new mongoose.Schema({
    name : {
        type : String,
        trim: true,
        required : true
    },
    email : {
        required : true,
        type : String,
        unique : true,
        lowercase: true,
        trim : true
    },
    password : {
        required : true,
        type : String,
        trim : true
    },
    shopName : {
        type : String,
        trim : true,
        required : true
    },
    shopLocation : {
        type : String,
        trim : true,
        required : true
    },
    refreshToken: {
        type: String,
        default: "",
        trim : true
    }
},{
    timestamps : true,
    versionKey : false
});

userModel.pre("save", async function () {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    } catch (error) {
        next(error);
    }
});

userModel.methods.comparedPassword =  async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export const User = mongoose.model("users", userModel);