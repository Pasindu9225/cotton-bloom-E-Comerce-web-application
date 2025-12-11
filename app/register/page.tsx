// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/login?registered=true"); // Redirect to login
            } else {
                const err = await res.json();
                setError(err.message || "Something went wrong.");
            }
        } catch (err) {
            setError("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Join Cotton Bloom today.</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <input name="fullName" type="text" required className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email address</label>
                            <input name="email" type="email" required className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <input name="password" type="password" required minLength={6} className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 rounded-md bg-black py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="font-semibold text-black dark:text-white hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}