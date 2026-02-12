"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/admin",
                errorCallbackURL: "/admin/login",
            });
        } catch {
            setError("Failed to connect to Google. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950" />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        NextWP<span className="text-blue-500">-lite</span>
                    </h1>
                    <p className="text-neutral-500 text-sm mt-2">
                        Modern Serverless CMS
                    </p>
                </div>

                {/* Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <h2 className="text-xl font-semibold text-white mb-2 text-center">
                        Welcome back
                    </h2>
                    <p className="text-neutral-500 text-sm text-center mb-8">
                        Sign in to access the admin panel
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 rounded-xl text-gray-800 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-black/20"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <p className="text-center text-xs text-neutral-600 mt-6">
                        Access is invite-only. Contact your admin for access.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-neutral-600 mt-6">
                    Powered by Better Auth • Deployed on Vercel
                </p>
            </div>
        </div>
    );
}
