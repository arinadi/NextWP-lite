import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import SingleClient from "@/components/SingleClient";
import Comments from "@/components/Comments";
import { getOption, getOptions } from "@/lib/options";

interface SlugPageProps {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.join("/") || "home";
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: "Not Found" };
    }

    const title = await getOption<string>("site_title") || "NextWP-lite";

    return {
        title: `${post.title} — ${title}`,
        description: post.excerpt || `Read ${post.title} on ${title}`,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: "article",
            ...(post.featuredImage && {
                images: [{ url: post.featuredImage }],
            }),
        },
    };
}

export default async function SlugPage({ params }: SlugPageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.join("/") || "home";

    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const allPosts = await getPublishedPosts(10);

    // Fetch real site settings
    const opts = await getOptions(["site_title", "site_tagline", "site_menus", "discussion_settings", "giscus_settings", "disqus_settings"]);

    const dynamicSettings = {
        title: opts.site_title || "NextWP-lite",
        tagline: opts.site_tagline || "Modern Serverless CMS",
        menus: opts.site_menus || { primary: [], footer: [] },
    };

    const discSettings = opts.discussion_settings || { allowComments: false, provider: "giscus" };

    return (
        <>
            <SingleClient
                post={post}
                allPosts={allPosts}
                settings={dynamicSettings}
            />
            {discSettings.allowComments && (
                <div className="container mx-auto px-4 max-w-4xl pb-20">
                    <Comments
                        slug={slug}
                        provider={discSettings.provider}
                        giscusConfig={opts.giscus_settings}
                        disqusConfig={opts.disqus_settings}
                    />
                </div>
            )}
        </>
    );
}
