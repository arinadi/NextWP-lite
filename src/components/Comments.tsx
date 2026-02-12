"use client";

import React from "react";

interface CommentsProps {
    slug: string;
    provider?: string;
    giscusConfig?: {
        repo?: string;
        repoId?: string;
        category?: string;
        categoryId?: string;
    };
    disqusConfig?: {
        shortname?: string;
    };
}

/**
 * Giscus/Disqus comment widget.
 *
 * Configured via the admin settings panel (options table)
 */
export default function Comments({
    slug,
    provider = "giscus",
    giscusConfig,
    disqusConfig,
}: CommentsProps) {
    const isGiscus = provider === "giscus";
    const isDisqus = provider === "disqus";

    // --- GISCUS LOGIC ---
    if (isGiscus) {
        const hasConfig = giscusConfig?.repo && giscusConfig?.repoId;
        if (!hasConfig) {
            return (
                <section id="comments" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-6 text-center text-gray-600 dark:text-blue-200">
                        <p className="text-sm">
                            💬 Comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Giscus</a>.
                            Configure your repository in <strong>Admin → Settings → Discussion</strong>.
                        </p>
                    </div>
                </section>
            );
        }

        return (
            <section id="comments" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>
                <script
                    src="https://giscus.app/client.js"
                    data-repo={giscusConfig.repo}
                    data-repo-id={giscusConfig.repoId}
                    data-category={giscusConfig.category || "General"}
                    data-category-id={giscusConfig.categoryId}
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

    // --- DISQUS LOGIC ---
    if (isDisqus) {
        const hasConfig = disqusConfig?.shortname;
        if (!hasConfig) {
            return (
                <section id="comments" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900 rounded-lg p-6 text-center text-neutral-600 dark:text-orange-200">
                        <p className="text-sm">
                            💬 Comments are powered by <strong>Disqus</strong>.
                            Set your <strong>Shortname</strong> in <strong>Admin → Settings → Discussion</strong>.
                        </p>
                    </div>
                </section>
            );
        }

        return (
            <section id="comments" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>
                <div id="disqus_thread"></div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        var disqus_config = function () {
                            this.page.url = window.location.href;
                            this.page.identifier = '${slug}';
                        };
                        (function() {
                            var d = document, s = d.createElement('script');
                            s.src = 'https://${disqusConfig.shortname}.disqus.com/embed.js';
                            s.setAttribute('data-timestamp', +new Date());
                            (d.head || d.body).appendChild(s);
                        })();
                        `,
                    }}
                />
            </section>
        );
    }

    return null;
}
