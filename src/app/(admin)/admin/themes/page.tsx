"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Check, PaintBucket } from "lucide-react";

interface ThemeInfo {
    id: string;
    name: string;
    version: string;
    author: string;
    description: string;
    isActive: boolean;
}

export default function ThemesPage() {
    const [themes, setThemes] = useState<ThemeInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState<string | null>(null);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/themes");
            const data = await r.json();
            setThemes(data.data || []);
        } catch (e) {
            console.error("Fetch themes error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, []);

    const handleActivate = async (themeId: string) => {
        setActivating(themeId);
        try {
            await fetch("/api/options/active_theme", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: themeId }),
            });
            fetchThemes();
        } catch (e) {
            console.error("Activate theme error:", e);
        } finally {
            setActivating(null);
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-light text-gray-100">Themes</h1>
            <p className="text-sm text-gray-500">Manage your site&apos;s appearance. Activate a theme to change the frontend look.</p>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className={`bg-neutral-800 border rounded-sm overflow-hidden transition-colors ${theme.isActive ? "border-blue-500 ring-1 ring-blue-500/30" : "border-neutral-700 hover:border-neutral-600"}`}
                        >
                            {/* Theme Preview Placeholder */}
                            <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                                <PaintBucket size={40} className={theme.isActive ? "text-blue-400" : "text-neutral-600"} />
                            </div>

                            <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-gray-200">{theme.name}</h3>
                                    {theme.isActive && (
                                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Check size={10} /> Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">{theme.description}</p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs text-gray-500">v{theme.version} by {theme.author}</span>
                                    {!theme.isActive && (
                                        <button
                                            onClick={() => handleActivate(theme.id)}
                                            disabled={activating === theme.id}
                                            className="px-3 py-1 text-xs font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300 disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {activating === theme.id ? <Loader2 size={10} className="animate-spin" /> : null}
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
