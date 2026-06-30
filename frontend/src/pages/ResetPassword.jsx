import { useState } from "react";

import { useNavigate, useParams, Link } from "react-router-dom";

import API from "../services/api";

import AuthLayout from "../layout/AuthLayout";
import { Field, Input, Button, Alert } from "../components/ui";

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
        <AuthLayout
            title="Reset password"
            subtitle="Choose a new password for your account"
            footer={
                <>
                    Back to{" "}
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

                <Field label="New password" required>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                    />
                </Field>

                <Field label="Confirm password" required>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                    />
                </Field>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Resetting…" : "Reset password"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;