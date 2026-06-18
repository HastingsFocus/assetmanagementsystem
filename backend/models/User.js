import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "HOD",
                "Principal",
                "Accounts",
                "Stores",
                "Admin"
            ],
            required: true
        },

        department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  default: null,
},

        resetPasswordToken: String,

        resetPasswordExpire: Date
    },

    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);