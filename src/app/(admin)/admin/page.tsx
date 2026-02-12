"use client";

import React, { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Users, Loader2 } from "lucide-react";
import Link from "next/link";

interface Stats {
    postCount: number;
    pageCount: number;
    mediaCount: number;
    draftCount: number;
    userCount: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Quick Draft state
    const [draftTitle, setDraftTitle] = useState("");
    const [draftContent, setDraftContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/stats")
            .then((r) => r.json())
            .then((data) => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSaveDraft = async () => {
        if (!draftTitle.trim()) return;
        setSaving(true);
        try {
            await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: draftTitle,
                    content: draftContent ? [{ type: "paragraph", content: [{ type: "text", text: draftContent }] }] : [],
                    status: "draft",
                    type: "post",
                }),
            });
            setDraftTitle("");
            setDraftContent("");
            setSaved(true);
            // Refresh stats
            const r = await fetch("/api/stats");
            setStats(await r.json());
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            console.error("Save draft failed:", e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-light text-gray-100">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* At a Glance Widget */}
                <div className="col-span-1 md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-sm p-0 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 bg-neutral-800">
                        At a Glance
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        {loading ? (
                            <div className="col-span-2 flex items-center justify-center py-4">
                                <Loader2 className="animate-spin text-gray-500" size={20} />
                            </div>
                        ) : stats ? (
                            <>
                                <div className="space-y-2">
                                    <Link href="/admin/posts" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                        <FileText size={16} /> <span>{stats.postCount} Posts</span>
                                    </Link>
                                    <Link href="/admin/pages" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                        <FileText size={16} /> <span>{stats.pageCount} Pages</span>
                                    </Link>
                                    <Link href="/admin/posts?status=draft" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                        <FileText size={16} /> <span>{stats.draftCount} Drafts</span>
                                    </Link>
                                </div>
                                <div className="space-y-2">
                                    <Link href="/admin/media" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                        <ImageIcon size={16} /> <span>{stats.mediaCount} Media</span>
                                    </Link>
                                    <Link href="/admin/users" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                        <Users size={16} /> <span>{stats.userCount} Users</span>
                                    </Link>
                                    <div className="text-gray-500 text-sm pt-1">
                                        NextWP-lite running on Vercel
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2 text-gray-500 text-sm">Failed to load stats</div>
                        )}
                    </div>
                </div>

                {/* Quick Draft Widget */}
                <div className="col-span-1 md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 bg-neutral-800">
                        Quick Draft
                    </div>
                    <div className="p-4 space-y-3">
                        <input
                            type="text"
                            placeholder="Title"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <textarea
                            className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-2 h-24 focus:outline-none focus:border-blue-500"
                            placeholder="What's on your mind?"
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                        />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={saving || !draftTitle.trim()}
                                className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="animate-spin" size={14} /> : null}
                                Save Draft
                            </button>
                            {saved && <span className="text-green-400 text-xs">Draft saved!</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
