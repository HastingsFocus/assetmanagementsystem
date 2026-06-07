import { useState } from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

const ForgotPassword = () => {

    /*
    ========================================
    STATE
    ========================================
    */

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    /*
    ========================================
    SUBMIT REQUEST
    ========================================
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        try {

            setLoading(true);

            const response = await API.post(
                "/auth/forgot-password",
                { email }
            );

            setMessage(response.data.message);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Forgot Password
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Enter your email to receive reset link
                </p>

                {message && (

                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>

                )}

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
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >

                        {loading
                            ? "Sending..."
                            : "Send Reset Link"
                        }

                    </button>

                </form>

                {/* BACK TO LOGIN */}

                <p className="text-center text-sm text-gray-600 mt-6">

                    Remember your password?

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

export default ForgotPassword;