"use client";

import React from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Sidebar from "../components/Sidebar";
import type { Post, SiteSettings } from "@/types/theme";

interface SingleTemplateProps {
    post: Post;
    allPosts: Post[];
    settings: SiteSettings;
    onBack: () => void;
    onPostClick: (post: Post) => void;
}

export default function SingleTemplate({
    post,
    allPosts,
    onBack,
    onPostClick,
}: SingleTemplateProps) {
    if (!post) return null;

    const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

    return (
        <article className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
            {/* Article Header */}
            <header className="pt-20 pb-16 container mx-auto px-4 text-left max-w-4xl">
                <button
                    onClick={onBack}
                    className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="flex items-center justify-start gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest mb-6">
                    <span>{post.category}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center justify-start gap-6 text-gray-500 dark:text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-900 dark:text-white">{post.author.name}</span>
                    </div>
                    <span>•</span>
                    <time>
                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                </div>
            </header>

            {/* Main Layout Grid */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Featured Image */}
                        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-xl mb-12">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Content Body */}
                        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            <p>
                                (Mock Content filler) Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800">
                            <div className="flex flex-wrap gap-2">
                                {post.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Author Box */}
                        <div className="mt-12 p-8 bg-gray-50 dark:bg-neutral-950 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-neutral-900"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                                    About {post.author.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Tech enthusiast and lead developer at NextWP-lite. Loves building serverless applications and sharing knowledge with the community.
                                </p>
                            </div>
                        </div>

                        {/* Comments */}
                        <div id="comments-wrapper" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-6 text-center text-gray-600 dark:text-blue-200">
                                <MessageSquare className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Comments Widget (Giscus/Disqus) will be injected here.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Sidebar posts={relatedPosts} title="Related Posts" onPostClick={onPostClick} />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
