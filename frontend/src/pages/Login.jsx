import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

import { connectSocket } from "../sockets/socketManager";

import AuthLayout from "../layout/AuthLayout";
import { Field, Input, Button, Alert } from "../components/ui";

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
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue to your workspace"
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-white hover:underline"
                    >
                        Register
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error ? <Alert variant="error">{error}</Alert> : null}

                <Field label="Email address" required>
                    <Input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                    />
                </Field>

                <div>
                    <label htmlFor="login-password" className="label">
                        Password<span className="text-red-500"> *</span>
                    </label>
                    <div className="relative">
                        <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            className="input pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-400 hover:text-ink-700"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-brand-600 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;