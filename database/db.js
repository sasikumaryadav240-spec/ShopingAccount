import { mongoose } from "mongoose";
import dotenv from "dotenv";

export const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DataBase Connected");
    } catch (error) {
        console.log(error);
    }
}