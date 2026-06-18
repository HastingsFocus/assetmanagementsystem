import mongoose from "mongoose";
import dotenv from "dotenv";

import Department from "../models/Department.js";
import { departments } from "../data/departments.js";


dotenv.config();


const seedDepartments = async () => {

    try {


        await mongoose.connect(process.env.MONGO_URI);


        console.log("MongoDB connected");


        await Department.deleteMany();


        await Department.insertMany(departments);


        console.log("Departments inserted successfully");


        process.exit();



    } catch(error){

        console.log(error);

        process.exit(1);

    }

};


seedDepartments();