import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const verifyToken = ( req, res, next ) => {
    const header = req.headers.authorization;

    if(!header || !header.startsWith("Bearer ")){
        return res.status(401).json({ status: "failed", message: "Access Denied. No token provided." });
    }

    const token = header.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.accessToken);

        req.user = verified;

        next();
    } catch (error) {
        return res.status(403).json({ status: "failed", message: "Invalid or expired token" });
    }
}