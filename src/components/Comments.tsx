"use client";

import React from "react";

interface CommentsProps {
    slug: string;
    repo?: string;
    repoId?: string;
    category?: string;
    categoryId?: string;
}

/**
 * Giscus comment widget.
 *
 * By default uses placeholder values — configure via the admin
 * settings panel (options table: giscus_repo, giscus_repo_id, etc.)
 * or pass props directly.
 *
 * @see https://giscus.app for configuration
 */
export default function Comments({
    slug,
    repo,
    repoId,
    category,
    categoryId,
}: CommentsProps) {
    // If no repo is configured, show a placeholder
    if (!repo && !repoId) {
        return (
            <section id="comments" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Discussion
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-6 text-center text-gray-600 dark:text-blue-200">
                    <p className="text-sm">
                        💬 Comments are powered by{" "}
                        <a
                            href="https://giscus.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline"
                        >
                            Giscus
                        </a>
                        . Configure your repository in{" "}
                        <strong>Admin → Settings</strong> to enable comments.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="comments" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Discussion
            </h3>
            <script
                src="https://giscus.app/client.js"
                data-repo={repo}
                data-repo-id={repoId}
                data-category={category}
                data-category-id={categoryId}
                data-mapping="specific"
                data-term={slug}
                data-strict="0"
                data-reactions-enabled="1"
                data-emit-metadata="0"
                data-input-position="top"
                data-theme="preferred_color_scheme"
                data-lang="en"
                data-loading="lazy"
                crossOrigin="anonymous"
                async
            />
        </section>
    );
}
