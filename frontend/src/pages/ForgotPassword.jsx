import { useState } from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

import AuthLayout from "../layout/AuthLayout";
import { Field, Input, Button, Alert } from "../components/ui";

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
        <AuthLayout
            title="Forgot password"
            subtitle="Enter your email and we'll send you a reset link"
            footer={
                <>
                    Remember your password?{" "}
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
                {message ? <Alert variant="success">{message}</Alert> : null}
                {error ? <Alert variant="error">{error}</Alert> : null}

                <Field label="Email address" required>
                    <Input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                </Field>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending…" : "Send reset link"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;