"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HomeTemplate from "@/themes/default/templates/Home";
import type { Post, SiteSettings } from "@/types/theme";

interface HomeClientProps {
    posts: Post[];
    settings: SiteSettings;
}

function EmptyState() {
    return (
        <main className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center transition-colors duration-300">
            <div className="text-center px-4 py-20 max-w-lg">
                <div className="w-20 h-20 mx-auto mb-8 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">✍️</span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                    No Posts Yet
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                    This site is freshly set up. Head over to the admin dashboard to
                    create your first post!
                </p>
                <a
                    href="/admin/posts/editor"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    Create Your First Post →
                </a>
            </div>
        </main>
    );
}

export default function HomeClient({ posts, settings }: HomeClientProps) {
    const router = useRouter();

    if (!posts || posts.length === 0) {
        return <EmptyState />;
    }

    const handlePostClick = (post: Post) => {
        router.push(`/${post.slug}`);
    };

    return (
        <HomeTemplate
            posts={posts}
            settings={settings}
            onPostClick={handlePostClick}
        />
    );
}
