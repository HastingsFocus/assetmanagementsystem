import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
==================================
AUTH MIDDLEWARE
- Verifies JWT token
- Attaches user to request
==================================
*/

export const protect = async (req, res, next) => {
    try {
        let token;

        /*
        ==================================
        GET TOKEN FROM HEADER
        Format: Bearer <token>
        ==================================
        */

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token provided"
            });
        }

        /*
        ==================================
        VERIFY TOKEN
        ==================================
        */

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        /*
        ==================================
        GET USER FROM TOKEN
        ==================================
        */

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        /*
        ==================================
        ATTACH USER TO REQUEST
        ==================================
        */

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed"
        });
    }
};