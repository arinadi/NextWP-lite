"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface PageOption {
    id: string;
    title: string;
}

export default function SettingsPage() {
    const [siteTitle, setSiteTitle] = useState("");
    const [siteTagline, setSiteTagline] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [pages, setPages] = useState<PageOption[]>([]);

    // Reading settings
    const [showOnFront, setShowOnFront] = useState("posts"); // 'posts' | 'page'
    const [pageOnFront, setPageOnFront] = useState("");
    const [pageForPosts, setPageForPosts] = useState("");

    // Discussion settings
    const [allowComments, setAllowComments] = useState(true);
    const [commentProvider, setCommentProvider] = useState("giscus");
    const [giscusRepo, setGiscusRepo] = useState("");
    const [disqusShortname, setDisqusShortname] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [titleRes, taglineRes, readingRes, discussionRes, pagesRes] = await Promise.all([
                    fetch("/api/options/site_title").then((r) => r.json()),
                    fetch("/api/options/site_tagline").then((r) => r.json()),
                    fetch("/api/options/reading_settings").then((r) => r.json()),
                    fetch("/api/options/discussion_settings").then((r) => r.json()),
                    fetch("/api/posts?type=page&status=published&limit=100").then((r) => r.json()),
                ]);

                setSiteTitle((titleRes.value as string) || "NextWP-lite");
                setSiteTagline((taglineRes.value as string) || "Modern Serverless CMS");

                if (readingRes.value) {
                    const r = readingRes.value as any;
                    setShowOnFront(r.showOnFront || "posts");
                    setPageOnFront(r.pageOnFront || "");
                    setPageForPosts(r.pageForPosts || "");
                }

                if (discussionRes.value) {
                    const d = discussionRes.value as any;
                    setAllowComments(d.allowComments ?? true);
                    setCommentProvider(d.provider || "giscus");
                    setGiscusRepo(d.giscusRepo || "");
                    setDisqusShortname(d.disqusShortname || "");
                }

                if (pagesRes.data) {
                    setPages(pagesRes.data.map((p: any) => ({ id: p.id, title: p.title })));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await Promise.all([
                fetch("/api/options/site_title", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ value: siteTitle }),
                }),
                fetch("/api/options/site_tagline", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ value: siteTagline }),
                }),
                fetch("/api/options/reading_settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        value: { showOnFront, pageOnFront, pageForPosts },
                    }),
                }),
                fetch("/api/options/discussion_settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        value: { allowComments, provider: commentProvider, giscusRepo, disqusShortname },
                    }),
                }),
            ]);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-gray-500" size={24} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-light text-gray-100">Settings</h1>

            {/* General Settings */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                    General Settings
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Site Title</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={siteTitle}
                                onChange={(e) => setSiteTitle(e.target.value)}
                                className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Tagline</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={siteTagline}
                                onChange={(e) => setSiteTagline(e.target.value)}
                                className="w-full md:w-2/3 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reading Settings */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                    Reading Settings
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <label className="text-sm text-gray-400 pt-1">Your homepage displays</label>
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="radio"
                                    name="showOnFront"
                                    value="posts"
                                    checked={showOnFront === "posts"}
                                    onChange={(e) => setShowOnFront(e.target.value)}
                                    className="accent-blue-600"
                                />
                                Your latest posts
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="radio"
                                    name="showOnFront"
                                    value="page"
                                    checked={showOnFront === "page"}
                                    onChange={(e) => setShowOnFront(e.target.value)}
                                    className="accent-blue-600"
                                />
                                A static page
                            </label>
                        </div>
                    </div>

                    {showOnFront === "page" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm text-gray-400 pl-6">Homepage:</label>
                                <div className="md:col-span-2">
                                    <select
                                        value={pageOnFront}
                                        onChange={(e) => setPageOnFront(e.target.value)}
                                        className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">— Select —</option>
                                        {pages.map((p) => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm text-gray-400 pl-6">Posts page:</label>
                                <div className="md:col-span-2">
                                    <select
                                        value={pageForPosts}
                                        onChange={(e) => setPageForPosts(e.target.value)}
                                        className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">— Select —</option>
                                        {pages.map((p) => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Discussion Settings */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                    Discussion Settings
                </div>
                <div className="p-4 space-y-6">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            className="mt-1 accent-blue-600 w-4 h-4"
                            checked={allowComments}
                            onChange={(e) => setAllowComments(e.target.checked)}
                        />
                        <div>
                            <label className="text-sm text-gray-200 font-medium">
                                Allow people to submit comments on new posts
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                (These settings may be overridden for individual posts.)
                            </p>
                        </div>
                    </div>

                    <hr className="border-neutral-700" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="text-sm text-gray-400 pt-2">Comment Service</label>
                        <div className="md:col-span-2 space-y-4">
                            <select
                                value={commentProvider}
                                onChange={(e) => setCommentProvider(e.target.value)}
                                className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="giscus">Giscus (GitHub Discussions)</option>
                                <option value="disqus">Disqus</option>
                            </select>
                        </div>
                    </div>

                    {commentProvider === "giscus" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="text-sm text-gray-400 pt-2">Giscus Repository</label>
                            <div className="md:col-span-2 space-y-2">
                                <input
                                    type="text"
                                    placeholder="username/repo"
                                    value={giscusRepo}
                                    onChange={(e) => setGiscusRepo(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {commentProvider === "disqus" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="text-sm text-gray-400 pt-2">Disqus Shortname</label>
                            <div className="md:col-span-2 space-y-2">
                                <input
                                    type="text"
                                    placeholder="example-site"
                                    value={disqusShortname}
                                    onChange={(e) => setDisqusShortname(e.target.value)}
                                    className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-4 py-3 border-t border-neutral-700 bg-neutral-800 flex justify-end items-center gap-3">
                    {saved && <span className="text-green-400 text-xs">Settings saved!</span>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <Loader2 size={14} className="animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
