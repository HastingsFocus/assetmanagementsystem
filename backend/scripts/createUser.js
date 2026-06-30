import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Department from "../models/Department.js";

dotenv.config();

const email = "kitchen@stjoseph.ac.mw";
const password = "12345678";
const name = "Kitchen Department";
const role = "HOD";
const departmentCode = "KITCHEN";

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let department = await Department.findOne({ code: departmentCode });
    if (!department) {
      department = await Department.create({
        name: "Kitchen",
        code: departmentCode,
        description: "Kitchen and catering department",
      });
      console.log("Created department:", department.code);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("User already exists:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department: department._id,
    });

    console.log("User created successfully:");
    console.log("  Email:", user.email);
    console.log("  Role:", user.role);
    console.log("  Department:", departmentCode);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create user:", error.message);
    process.exit(1);
  }
};

createUser();
