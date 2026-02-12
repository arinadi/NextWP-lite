"use client";

import React from "react";
import Link from "next/link";

const MOCK_POSTS = [
    { id: 1, title: "Hello World!", author: "Admin", category: "Uncategorized", date: "2023-10-25", status: "Published" },
    { id: 2, title: "Cara Deploy NextWP ke Vercel", author: "Arinadi", category: "Tutorial", date: "2023-10-26", status: "Published" },
    { id: 3, title: "Kenapa Serverless?", author: "Arinadi", category: "Opinion", date: "2023-10-27", status: "Draft" },
    { id: 4, title: "React vs PHP untuk SEO", author: "Admin", category: "Tech", date: "2023-10-28", status: "Published" },
    { id: 5, title: "Setup Neon Database", author: "Dev", category: "Database", date: "2023-10-29", status: "Trash" },
];

export default function PostsPage() {
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
                    <span className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium">All (12)</span> |
                    <span className="cursor-pointer hover:text-blue-300">Published (10)</span> |
                    <span className="cursor-pointer hover:text-blue-300">Drafts (1)</span> |
                    <span className="cursor-pointer hover:text-blue-300 text-red-400">Trash (1)</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300">
                        Search
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-neutral-900 text-gray-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-3 w-8"><input type="checkbox" className="accent-blue-600" /></th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Author</th>
                            <th className="p-3">Categories</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                        {MOCK_POSTS.map((post) => (
                            <tr key={post.id} className="group hover:bg-neutral-750 transition-colors">
                                <td className="p-3"><input type="checkbox" className="accent-blue-600" /></td>
                                <td className="p-3">
                                    <Link href="/admin/posts/editor" className="text-blue-400 font-medium text-base mb-1 cursor-pointer hover:underline block">
                                        {post.title}
                                    </Link>
                                    <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-blue-400 cursor-pointer hover:underline">Edit</span> |
                                        <span className="text-blue-400 cursor-pointer hover:underline">Quick Edit</span> |
                                        <span className="text-red-400 cursor-pointer hover:underline">Trash</span> |
                                        <span className="text-blue-400 cursor-pointer hover:underline">View</span>
                                    </div>
                                </td>
                                <td className="p-3 text-blue-400">{post.author}</td>
                                <td className="p-3 text-blue-400">{post.category}</td>
                                <td className="p-3">
                                    <div className={`text-xs ${post.status === "Published" ? "text-green-400" : post.status === "Draft" ? "text-yellow-500" : "text-red-400"}`}>
                                        {post.status}
                                    </div>
                                    <div>{post.date}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
