import { useState } from "react";

import { useNavigate, useParams, Link } from "react-router-dom";

import API from "../services/api";

const ResetPassword = () => {

    const { token } = useParams();

    const navigate = useNavigate();

    /*
    ========================================
    STATE
    ========================================
    */

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    /*
    ========================================
    SUBMIT RESET PASSWORD
    ========================================
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        /*
        ====================================
        VALIDATE PASSWORD MATCH
        ====================================
        */

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {

            setLoading(true);

            const response = await API.put(
                `/auth/reset-password/${token}`,
                { password }
            );

            setMessage(response.data.message);

            /*
            ====================================
            REDIRECT AFTER SUCCESS
            ====================================
            */

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Reset failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Reset Password
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Enter your new password
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

                    {/* NEW PASSWORD */}

                    <div>

                        <label className="block mb-2 font-medium">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>

                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"
                        }

                    </button>

                </form>

                {/* BACK TO LOGIN */}

                <p className="text-center text-sm text-gray-600 mt-6">

                    Back to

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

export default ResetPassword;