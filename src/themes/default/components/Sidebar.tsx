"use client";

import React, { useState } from "react";
import { Search, ArrowLeft, Clock } from "lucide-react";
import type { Post } from "@/types/theme";

interface SidebarProps {
    posts: Post[];
    title?: string;
    onPostClick: (post: Post) => void;
}

export default function Sidebar({ posts, title = "Related Posts", onPostClick }: SidebarProps) {
    const [query, setQuery] = useState("");

    return (
        <aside className="space-y-8 w-full">
            {/* Widget 1: Search */}
            <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Search size={18} /> Search
                </h3>
                <form action="/search" method="GET" className="relative">
                    <input
                        type="text"
                        name="q"
                        placeholder="Type and hit enter..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-3 text-gray-400 hover:text-blue-600">
                        <ArrowLeft size={18} className="rotate-180" />
                    </button>
                </form>
            </div>

            {/* Widget 2: Post List */}
            <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-neutral-800 pb-2">
                    {title}
                </h3>
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group cursor-pointer flex gap-4 items-start"
                            onClick={() => onPostClick(post)}
                        >
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.featuredImage}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1">
                                    {post.title}
                                </h4>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} /> {new Date(post.publishedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Widget 3: Categories */}
            <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {["Engineering", "Design", "SEO", "Trends", "Tutorials"].map((cat) => (
                        <span
                            key={cat}
                            className="px-3 py-1 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            </div>
        </aside>
    );
}
