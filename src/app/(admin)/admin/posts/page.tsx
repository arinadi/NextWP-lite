"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface PostRow {
    post: {
        id: string;
        title: string;
        slug: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    author: { name: string | null; email: string };
    category: { id: string; name: string } | null;
}

export default function PostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostRow[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const fetchPosts = async (status: string, q: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ type: "post" });
            if (status !== "all") params.set("status", status);
            if (q) params.set("search", q);
            const r = await fetch(`/api/posts?${params}`);
            const data = await r.json();
            setPosts(data.data || []);
            setCounts(data.counts || {});
        } catch (e) {
            console.error("Fetch posts error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(filter, search);
    }, [filter, search]);

    const handleTrash = async (id: string) => {
        if (!confirm("Move this post to trash?")) return;
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        fetchPosts(filter, search);
    };

    const handleSearch = () => {
        setSearch(searchInput);
    };

    const formatDate = (d: string) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const statusColor = (s: string) => {
        switch (s) {
            case "published": return "text-green-400";
            case "draft": return "text-yellow-500";
            case "trash": return "text-red-400";
            default: return "text-gray-400";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-light text-gray-100">Posts</h1>
                <Link
                    href="/admin/posts/editor"
                    className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 inline-flex items-center gap-1"
                >
                    Add New
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-800 p-2 rounded-sm border border-neutral-700">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    {["all", "published", "draft", "trash"].map((s) => (
                        <span key={s}>
                            <span
                                onClick={() => setFilter(s)}
                                className={`cursor-pointer hover:text-blue-300 ${filter === s ? "text-blue-400 font-medium" : ""} ${s === "trash" ? "text-red-400" : ""}`}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] || 0})
                            </span>
                            {s !== "trash" && <span className="ml-3">|</span>}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-gray-500" size={24} />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">No posts found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-neutral-900 text-gray-200 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Author</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-700">
                            {posts.map((post) => (
                                <tr
                                    key={post.post.id}
                                    className="border-b border-neutral-700 hover:bg-neutral-800 transition-colors cursor-pointer"
                                    onDoubleClick={() => router.push(`/admin/posts/editor?id=${post.post.id}`)}
                                >
                                    <td className="p-3">
                                        <Link href={`/admin/posts/editor?id=${post.post.id}`} className="text-blue-400 font-medium text-base mb-1 cursor-pointer hover:underline block">
                                            {post.post.title}
                                        </Link>
                                        <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/posts/editor?id=${post.post.id}`} className="text-blue-400 hover:underline">Edit</Link>
                                            <span>|</span>
                                            <button onClick={() => handleTrash(post.post.id)} className="text-red-400 hover:underline flex items-center gap-1">
                                                <Trash2 size={10} /> Trash
                                            </button>
                                            {post.post.status === "published" && (
                                                <>
                                                    <span>|</span>
                                                    <Link href={`/${post.post.slug}`} target="_blank" className="text-blue-400 hover:underline">View</Link>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3 text-blue-400">{post.author?.name || post.author?.email || "—"}</td>
                                    <td className="p-3 text-blue-400">{post.category?.name || "—"}</td>
                                    <td className="p-3">
                                        <div className={`text-xs capitalize ${statusColor(post.post.status)}`}>
                                            {post.post.status}
                                        </div>
                                        <div>{formatDate(post.post.createdAt)}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
