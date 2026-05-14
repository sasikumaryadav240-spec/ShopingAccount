import { mongoose } from "mongoose";

export const mongoDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/shopdata");
        console.log("DataBase Connected");
    } catch (error) {
        console.log(error);
    }
}