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
}

export default function PagesPage() {
    const router = useRouter();
    const [pages, setPages] = useState<PostRow[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchPages = async (status: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ type: "page" });
            if (status !== "all") params.set("status", status);
            const r = await fetch(`/api/posts?${params}`);
            const data = await r.json();
            setPages(data.data || []);
            setCounts(data.counts || {});
        } catch (e) {
            console.error("Fetch pages error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages(filter);
    }, [filter]);

    const handleTrash = async (id: string) => {
        if (!confirm("Move this page to trash?")) return;
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        fetchPages(filter);
    };

    const formatDate = (d: string) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-light text-gray-100">Pages</h1>
                <Link
                    href="/admin/posts/editor?type=page"
                    className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 inline-flex items-center gap-1"
                >
                    Add New
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 text-sm text-gray-400 bg-neutral-800 p-2 rounded-sm border border-neutral-700">
                {["all", "published", "draft", "trash"].map((s) => (
                    <span key={s}>
                        <span
                            onClick={() => setFilter(s)}
                            className={`cursor-pointer hover:text-blue-300 ${filter === s ? "text-blue-400 font-medium" : ""}`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] || 0})
                        </span>
                        {s !== "trash" && <span className="ml-3">|</span>}
                    </span>
                ))}
            </div>

            {/* Table */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-gray-500" size={24} />
                    </div>
                ) : pages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">No pages found. <Link href="/admin/posts/editor?type=page" className="text-blue-400 hover:underline">Create one</Link></div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-neutral-900 text-gray-200 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Author</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-700">
                            {pages.map((row) => (
                                <tr
                                    key={row.post.id}
                                    className="group hover:bg-neutral-750 transition-colors cursor-pointer"
                                    onDoubleClick={() => router.push(`/admin/posts/editor?id=${row.post.id}&type=page`)}
                                >
                                    <td className="p-3">
                                        <Link href={`/admin/posts/editor?id=${row.post.id}&type=page`} className="text-blue-400 font-medium hover:underline block">
                                            {row.post.title}
                                        </Link>
                                        <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                                            <Link href={`/admin/posts/editor?id=${row.post.id}&type=page`} className="text-blue-400 hover:underline">Edit</Link>
                                            <span>|</span>
                                            <button onClick={() => handleTrash(row.post.id)} className="text-red-400 hover:underline flex items-center gap-1">
                                                <Trash2 size={10} /> Trash
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-3">{row.author?.name || row.author?.email || "—"}</td>
                                    <td className="p-3">
                                        <div className={`text-xs capitalize ${row.post.status === "published" ? "text-green-400" : row.post.status === "draft" ? "text-yellow-500" : "text-red-400"}`}>
                                            {row.post.status}
                                        </div>
                                        <div>{formatDate(row.post.createdAt)}</div>
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
