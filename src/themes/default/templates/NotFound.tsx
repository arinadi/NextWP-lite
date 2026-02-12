import React from "react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center transition-colors duration-300">
            <div className="text-center px-4 py-20">
                <h1 className="text-8xl font-extrabold text-gray-200 dark:text-neutral-800 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    ← Back to Home
                </Link>
            </div>
        </main>
    );
}
