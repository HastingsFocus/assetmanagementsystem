import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

import { connectSocket } from "../sockets/socketManager";

import AuthLayout from "../layout/AuthLayout";
import { Field, Input, Button, Alert } from "../components/ui";

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

        if (!password) {
            return { text: "", className: "" };
        }

        if (password.length < 6) {
            return { text: "Weak", className: "text-red-600" };
        }

        if (
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
        ) {
            return { text: "Strong", className: "text-emerald-600" };
        }

        return { text: "Medium", className: "text-amber-600" };
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
            error.message ||
            "Registration failed"
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Register with your approved work email"
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-white hover:underline"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error ? <Alert variant="error">{error}</Alert> : null}

                <Field label="Full name" required>
                    <Input
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Jane Banda"
                    />
                </Field>

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
                    <label htmlFor="register-password" className="label">
                        Password<span className="text-red-500"> *</span>
                    </label>
                    <div className="relative">
                        <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            className="input pr-11"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-400 hover:text-ink-700"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <p className="mt-1.5 text-xs text-ink-500">
                        At least 6 characters with an uppercase letter, a number
                        and a symbol.
                    </p>
                </div>

                {strength.text ? (
                    <p className={`-mt-2 text-xs font-medium ${strength.className}`}>
                        Password strength: {strength.text}
                    </p>
                ) : null}

                <div>
                    <label htmlFor="register-confirm" className="label">
                        Confirm password<span className="text-red-500"> *</span>
                    </label>
                    <div className="relative">
                        <Input
                            id="register-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-enter your password"
                            className="input pr-11"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-400 hover:text-ink-700"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating account…" : "Create account"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Register;