"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2, Database, Shield, Globe, AlertTriangle } from "lucide-react";

type Step = "checking" | "setup" | "installing" | "login" | "done" | "already_installed";

export default function SetupPage() {
    const [step, setStep] = useState<Step>("checking");
    const [error, setError] = useState("");
    const [siteTitle, setSiteTitle] = useState("My NextWP Site");
    const [siteTagline, setSiteTagline] = useState("Just another NextWP-lite site");

    // Check if already installed
    useEffect(() => {
        async function checkInstall() {
            try {
                const res = await fetch("/api/setup");
                const data = await res.json();
                if (data.installed) {
                    setStep("already_installed");
                } else {
                    setStep("setup");
                }
            } catch {
                setStep("setup");
            }
        }
        checkInstall();
    }, []);

    const handleInstall = async () => {
        setStep("installing");
        setError("");

        try {
            // 1. Deploy database schema
            const res = await fetch("/api/setup", { method: "POST" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to deploy schema");
            }

            // 2. Save site settings
            // (Will be saved after login when we have a user context)
            localStorage.setItem("nextwp_setup_title", siteTitle);
            localStorage.setItem("nextwp_setup_tagline", siteTagline);

            setStep("login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Installation failed");
            setStep("setup");
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl: "/admin" });
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950" />

            <div className="relative w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        NextWP<span className="text-blue-500">-lite</span>
                    </h1>
                    <p className="text-neutral-500 text-sm mt-2">
                        Installation Wizard
                    </p>
                </div>

                {/* Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl shadow-black/50">

                    {/* Checking state */}
                    {step === "checking" && (
                        <div className="text-center py-8">
                            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
                            <p className="text-neutral-400">Checking installation status...</p>
                        </div>
                    )}

                    {/* Already installed */}
                    {step === "already_installed" && (
                        <div className="text-center py-4">
                            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">Already Installed</h2>
                            <p className="text-neutral-400 text-sm mb-6">
                                NextWP-lite is already set up and running.
                            </p>
                            <a
                                href="/admin/login"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Go to Login
                            </a>
                        </div>
                    )}

                    {/* Setup form */}
                    {step === "setup" && (
                        <>
                            {/* Progress steps */}
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                                    <span className="text-sm text-white font-medium">Configure</span>
                                </div>
                                <div className="w-8 h-px bg-neutral-700" />
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs font-bold">2</div>
                                    <span className="text-sm text-neutral-500">Sign In</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-white mb-6">Setup your CMS</h2>

                            {/* Error */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm flex items-start gap-2">
                                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            {/* Feature list */}
                            <div className="space-y-3 mb-6 p-4 bg-neutral-800/50 rounded-xl">
                                <div className="flex items-center gap-3 text-sm">
                                    <Database size={16} className="text-blue-400 flex-shrink-0" />
                                    <span className="text-neutral-300">Creates database tables</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield size={16} className="text-green-400 flex-shrink-0" />
                                    <span className="text-neutral-300">You become the Super Admin automatically</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Globe size={16} className="text-purple-400 flex-shrink-0" />
                                    <span className="text-neutral-300">Site goes live immediately after setup</span>
                                </div>
                            </div>

                            {/* Site config */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">Site Title</label>
                                    <input
                                        type="text"
                                        value={siteTitle}
                                        onChange={(e) => setSiteTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">Tagline</label>
                                    <input
                                        type="text"
                                        value={siteTagline}
                                        onChange={(e) => setSiteTagline(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleInstall}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Database size={16} />
                                Install NextWP-lite
                            </button>
                        </>
                    )}

                    {/* Installing state */}
                    {step === "installing" && (
                        <div className="text-center py-8">
                            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-white mb-2">Deploying Database Schema...</h2>
                            <p className="text-neutral-400 text-sm">Creating tables on Neon PostgreSQL</p>
                        </div>
                    )}

                    {/* Login step */}
                    {step === "login" && (
                        <div className="text-center py-4">
                            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">Database Ready!</h2>
                            <p className="text-neutral-400 text-sm mb-6">
                                Now sign in with Google to become the <span className="text-blue-400 font-medium">Super Admin</span>.
                            </p>

                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 rounded-xl text-gray-800 text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-black/20"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    )}

                    {/* Done */}
                    {step === "done" && (
                        <div className="text-center py-8">
                            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">All Done!</h2>
                            <p className="text-neutral-400 text-sm mb-6">Redirecting to dashboard...</p>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-neutral-600 mt-6">
                    Powered by Neon • Drizzle ORM • NextAuth.js
                </p>
            </div>
        </div>
    );
}
