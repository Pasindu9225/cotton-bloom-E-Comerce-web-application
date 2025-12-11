// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// Separate component for the form logic to use useSearchParams safely
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Show success message if redirected from registration
    const isRegistered = searchParams.get("registered") === "true";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        // Call NextAuth to sign in
        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false, // Prevent auto redirect so we can handle errors
        });

        if (res?.error) {
            setError("Invalid email or password.");
            setLoading(false);
        } else {
            router.push("/"); // Redirect to home page
            router.refresh(); // Refresh to update Navbar state
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter your details.</p>
            </div>

            {isRegistered && (
                <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 rounded-md text-center">
                    Account created! Please log in.
                </div>
            )}

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input name="email" type="email" required className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <input name="password" type="password" required className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 rounded-md bg-black py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
                </button>
            </form>
            <p className="text-center text-sm text-gray-500">
                Don't have an account? <Link href="/register" className="font-semibold text-black dark:text-white hover:underline">Sign up</Link>
            </p>
        </div>
    );
}

// Main Page Component wrapped in Suspense (Required for useSearchParams in Next.js)
export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}