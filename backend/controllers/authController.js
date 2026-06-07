import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { allowedUsers } from "../config/allowedUsers.js";
import { sendEmail } from "../services/emailService.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const allowedUser = allowedUsers.find(u => u.email === email);
        if (!allowedUser) {
            return res.status(403).json({ message: "Email not authorized" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: allowedUser.role,
            department: allowedUser.department
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        
const io = req.app.get("io");
        if (io) {
            io.to("ADMIN").emit("auth:registered", {
                message: "New user registered",
                user: {
                    id: user._id,
                    name: user.name,
                    role: user.role,
                    department: user.department
                }
            });
        }

        return res.status(201).json({
            message: "Registration successful",
            token,
            user
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Password Reset",
            `Reset your password:\n\n${resetUrl}\n\nLink expires in 15 minutes.`
        );

        return res.json({ message: "Reset email sent" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/*
==================================
RESET PASSWORD
==================================
*/

export const resetPassword = async (req, res) => {
    try {
        const resetToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.json({ message: "Password reset successful" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};