import User from "../models/User.js";
import Department from "../models/Department.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { allowedUsers } from "../config/allowedUsers.js";
import { sendEmail } from "../services/emailService.js";



/*
========================================
REGISTER USER
========================================
*/

export const registerUser = async (req, res) => {
    try {

        const { 
            name, 
            email, 
            password, 
            confirmPassword 
        } = req.body;


        // Validate fields
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        // Confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }


        // Check allowed users
        const allowedUser = allowedUsers.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );


        if (!allowedUser) {
            return res.status(403).json({
                message: "Email not authorized"
            });
        }



        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }



        /*
        ========================================
        FIND DEPARTMENT
        ========================================
        */


        let departmentId = null;


        if (allowedUser.departmentCode) {

            const department = await Department.findOne({
                code: allowedUser.departmentCode.toUpperCase()
            });


            console.log("Department Found:", department);


            if (!department) {
                return res.status(400).json({
                    message: `Department ${allowedUser.departmentCode} not found`
                });
            }


            departmentId = department._id;
        }



        /*
        ========================================
        CREATE USER
        ========================================
        */


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({

            name,

            email: email.toLowerCase(),

            password: hashedPassword,

            role: allowedUser.role,

            department: departmentId

        });



        /*
        ========================================
        GENERATE TOKEN
        ========================================
        */


        const token = jwt.sign(

            {
                id: user._id,
                role: user.role,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }

        );



        /*
        ========================================
        RETURN USER WITH DEPARTMENT DETAILS
        ========================================
        */


        const populatedUser = await User.findById(user._id)
            .populate("department", "name code");



        /*
        ========================================
        SOCKET NOTIFICATION
        ========================================
        */


        const io = req.app.get("io");


        if (io) {

            io.to("ADMIN").emit("auth:registered", {

                message: "New user registered",

                user: {

                    id: populatedUser._id,

                    name: populatedUser.name,

                    role: populatedUser.role,

                    department: populatedUser.department

                }

            });

        }



        return res.status(201).json({

            message: "Registration successful",

            token,

            user: populatedUser

        });



    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });

    }
};






/*
========================================
LOGIN USER
========================================
*/


export const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;



        const user = await User.findOne({

            email: email.toLowerCase()

        })
        .populate("department", "name code");



        if (!user) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }



        const isMatch = await bcrypt.compare(
            password,
            user.password
        );



        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }



        const token = jwt.sign(

            {
                id: user._id,
                role: user.role,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }

        );



        return res.status(200).json({

            message: "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                department: user.department

            }

        });



    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};







/*
========================================
FORGOT PASSWORD
========================================
*/


export const forgotPassword = async (req, res) => {

    try {


        const { email } = req.body;


        const user = await User.findOne({
            email
        });


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }



        const resetToken = crypto.randomBytes(32).toString("hex");



        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");



        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;



        await user.save();



        const resetUrl =
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`;



        await sendEmail(

            user.email,

            "Password Reset",

            `Reset your password using this link:

${resetUrl}

This link expires in 15 minutes.`

        );



        return res.json({
            message: "Reset email sent"
        });



    } catch(error) {


        return res.status(500).json({
            message: error.message
        });


    }

};







/*
========================================
RESET PASSWORD
========================================
*/


export const resetPassword = async (req, res) => {

    try {


        const token = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");



        const user = await User.findOne({

            resetPasswordToken: token,

            resetPasswordExpire: {
                $gt: Date.now()
            }

        });



        if (!user) {

            return res.status(400).json({
                message: "Invalid token"
            });

        }



        user.password = await bcrypt.hash(
            req.body.password,
            10
        );


        user.resetPasswordToken = undefined;

        user.resetPasswordExpire = undefined;



        await user.save();



        return res.json({

            message: "Password reset successful"

        });



    } catch(error) {


        return res.status(500).json({
            message:error.message
        });


    }

};