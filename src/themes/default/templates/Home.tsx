"use client";

import React from "react";
import { User, Calendar, ChevronRight } from "lucide-react";
import type { Post, SiteSettings } from "@/types/theme";

interface HomeTemplateProps {
    posts: Post[];
    settings: SiteSettings;
    onPostClick: (post: Post) => void;
}

export default function HomeTemplate({ posts, onPostClick }: HomeTemplateProps) {
    const featuredPost = posts[0];
    const regularPosts = posts.slice(1);

    return (
        <main className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
            {/* Hero / Featured Section */}
            <section className="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                Featured Post
                            </div>
                            <h2
                                className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => onPostClick(featuredPost)}
                            >
                                {featuredPost.title}
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={featuredPost.author.avatar}
                                        alt={featuredPost.author.name}
                                        className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-neutral-800"
                                    />
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {featuredPost.author.name}
                                        </p>
                                        <p className="text-gray-500">
                                            {new Date(featuredPost.publishedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="order-1 md:order-2 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 cursor-pointer group"
                            onClick={() => onPostClick(featuredPost)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={featuredPost.featuredImage}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Posts Grid */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h3>
                    <a
                        href="#"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        View Archive <ChevronRight size={16} />
                    </a>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-gray-50 dark:bg-neutral-950 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full"
                        >
                            <div
                                className="aspect-video overflow-hidden cursor-pointer"
                                onClick={() => onPostClick(post)}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                                    {post.category}
                                </div>
                                <h4
                                    className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => onPostClick(post)}
                                >
                                    {post.title}
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                                    {post.excerpt}
                                </p>

                                <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 mt-auto flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <User size={14} /> {post.author.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />{" "}
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
