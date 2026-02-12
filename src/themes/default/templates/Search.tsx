"use client";

import React from "react";
import { Search, User, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import type { Post } from "@/types/theme";

interface SearchTemplateProps {
    searchQuery: string;
    allPosts: Post[];
    onPostClick: (post: Post) => void;
}

export default function SearchTemplate({
    searchQuery,
    allPosts,
    onPostClick,
}: SearchTemplateProps) {
    const results = allPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const mostReadPosts = allPosts.slice(0, 4);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
            <div className="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Search Results
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Found {results.length} result(s) for &quot;{searchQuery}&quot;
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Results List */}
                    <div className="lg:col-span-2 space-y-8">
                        {results.length > 0 ? (
                            results.map((post) => (
                                <article
                                    key={post.id}
                                    className="flex flex-col md:flex-row gap-6 group cursor-pointer"
                                    onClick={() => onPostClick(post)}
                                >
                                    <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={post.featuredImage}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 py-2">
                                        <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
                                            {post.category}
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <User size={12} /> {post.author.name}
                                            <span>•</span>
                                            <Calendar size={12} />{" "}
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50 dark:bg-neutral-950 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800">
                                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    No results found
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Try different keywords or check spelling.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Sidebar posts={mostReadPosts} title="Most Read" onPostClick={onPostClick} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
