import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import { connectSocket } from "../sockets/socketManager";

const Register = () => {

    const navigate = useNavigate();

    const { register } = useAuth();

    /*
    ========================================
    FORM STATE
    ========================================
    */

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    /*
    ========================================
    HANDLE INPUT CHANGE
    ========================================
    */

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    /*
    ========================================
    PASSWORD VALIDATION
    ========================================
    */

    const validatePassword = (password) => {

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        return passwordRegex.test(password);
    };

    /*
    ========================================
    PASSWORD STRENGTH
    ========================================
    */

    const getPasswordStrength = () => {

        const password = formData.password;

        if (password.length < 6) {
            return {
                text: "Weak",
                color: "red"
            };
        }

        if (
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
        ) {
            return {
                text: "Strong",
                color: "green"
            };
        }

        return {
            text: "Medium",
            color: "orange"
        };
    };

    const strength = getPasswordStrength();

    /*
    ========================================
    SUBMIT FORM
    ========================================
    */

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validatePassword(formData.password)) {
        return setError(
            "Password must be at least 6 characters and include uppercase, number and symbol"
        );
    }

    if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match");
    }

    try {
        setLoading(true);

        const userData = await register(formData);

        sessionStorage.setItem("token", userData.token);

        connectSocket(userData.token);

        navigate("/dashboard");

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Registration failed"
        );
    } finally {
        setLoading(false);
    }
};

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Inventory Management System
                </p>

                {error && (

                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>

                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* NAME */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter your name"
                        />

                    </div>

                    {/* EMAIL */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter your email"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter password"
                            />

                            <button
                                type="button"
                                className="absolute right-4 top-4 text-gray-500"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >

                                {showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }

                            </button>

                        </div>

                        {/* PASSWORD STRENGTH */}

                        <p
                            className={`mt-2 text-sm text-${strength.color}-600`}
                        >
                            Password Strength: {strength.text}
                        </p>

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Confirm password"
                            />

                            <button
                                type="button"
                                className="absolute right-4 top-4 text-gray-500"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >

                                {showConfirmPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }

                            </button>

                        </div>

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>

                </form>

                {/* LOGIN LINK */}

                <p className="text-center text-sm text-gray-600 mt-6">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-black font-semibold ml-1 hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Register;