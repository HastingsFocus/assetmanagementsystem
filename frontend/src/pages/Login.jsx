import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import { connectSocket } from "../sockets/socketManager";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    /*
    ========================================
    FORM STATE
    ========================================
    */

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

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

const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const userData = await login(formData);

        sessionStorage.setItem("token", userData.token);

        connectSocket(userData.token);

        navigate("/dashboard", { replace: true });

    } catch (error) {
        setError(
            error.response?.data?.message ||
            error.message ||
            "Login failed"
        );
    } finally {
        setLoading(false);
    }
};


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Welcome Back
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Login to Inventory Management System
                </p>

                {error && (

                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

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
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
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
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-4 text-gray-500"
                            >

                                {showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }

                            </button>

                        </div>

                    </div>

                    {/* FORGOT PASSWORD */}

                    <div className="flex justify-end">

                        <Link
                            to="/forgot-password"
                            className="text-sm text-black hover:underline"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

                {/* REGISTER LINK */}

                <p className="text-center text-sm text-gray-600 mt-6">

                    Don&apos;t have an account?

                    <Link
                        to="/register"
                        className="text-black font-semibold ml-1 hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Login;