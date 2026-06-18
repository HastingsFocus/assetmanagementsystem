import Department from "../models/Department.js";

/*
========================================================
GET ALL DEPARTMENTS
========================================================
*/
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });

        return res.status(200).json({
            success: true,
            count: departments.length,
            departments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};