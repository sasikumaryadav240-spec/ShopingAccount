import { User } from "../Models/user.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export const changePassword = async (req, res) => {
    const userId = req.user.userId;

    const { currentPassword, password } = req.body;

    try {
        const userDetails = await User.findOne({ _id : userId });

        const confirmPassword = await userDetails.comparedPassword(currentPassword);
        if(!confirmPassword){
            return res.status(400).json("Passwords didn't match!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(
            userId,
            { $set: { password: hashedPassword } }
        );

        res.status(200).json("Passwords Successfully Changed");
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const newrefreshToken = async (req, res) => {
    const refreshToken = req.body;

    try {
        const decode = await jwt.verify(refreshToken, process.env.refreshToken);

        const user = await User.findById(decode.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid or Expired Refresh Token" });
        }

        const newAccessToken = await jwt.sign(
            {userId : user._id},
            process.env.accessToken,
            { expiresIn : "1d" }
        );

        res.status(200).json({
            accessToken : newAccessToken
        });
    } catch (error) {
        res.status(500).json(error.message)
    }
}