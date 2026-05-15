import { User } from "../Models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signIn = async (req, res) => {
    const { name, email, password, shopName, shopLocation } = req.body;
    try {
        const normalizedEmail = email.toLowerCase();
        const oldUser = await User.findOne({ normalizedEmail });
        if(oldUser) return res.status(400).json({
            status : "failed",
            message : "User Already Exists"
        })
        const user = await User.create({
            normalizedEmail,
            email,
            password,
            shopName,
            shopLocation
        });

        res.status(201).json({
            name : name,
            email : email,
            shopName : shopName
        });
    } catch (error) {
        console.error("SignIn Error:", error);
        res.status(500).json(error.message);
    }
}

export const loginIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email.toLowerCase();
        const oldUser = await User.findOne({ email: normalizedEmail });
        if(!oldUser) return res.status(404).json({
            status : "failed",
            message : "User Doesn't Exists"
        })
        const user = await oldUser.comparedPassword(password);

        if(!user) return res.status(400).json({
            status : "failed",
            message : "Passwords doesn't match"
        })

        const accessToken = jwt.sign(
            {userId : oldUser._id},
            process.env.accessToken,
            { expiresIn : "1d" }
        );

        const refreshToken = jwt.sign(
            {userId : oldUser._id},
            process.env.refreshToken,
            { expiresIn : "7d" }
        );

        oldUser.refreshToken = refreshToken;
        await oldUser.save();

        res.status(201).json({
            status : "success",
            message : "Logined Successfully",
            accessToken : accessToken,
            refreshToken : refreshToken
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}