"use client";

export default function OfflinePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-neutral-900 text-white">
            <div className="w-20 h-20 mx-auto mb-8 bg-neutral-800 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📡</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4">You&apos;re Offline</h1>
            <p className="text-neutral-400 text-lg max-w-md mb-8">
                It looks like you&apos;ve lost your internet connection.
                Please check your network and try again.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
        </main>
    );
}
