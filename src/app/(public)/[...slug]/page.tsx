import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { SITE_SETTINGS } from "@/lib/site-settings";
import SingleClient from "@/components/SingleClient";
import Comments from "@/components/Comments";

interface SlugPageProps {
    params: Promise<{ slug: string[] }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.join("/") || "home";

    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const allPosts = await getPublishedPosts(10);

    return (
        <>
            <SingleClient
                post={post}
                allPosts={allPosts}
                settings={SITE_SETTINGS}
            />
            <div className="container mx-auto px-4 max-w-4xl pb-20">
                <Comments slug={slug} />
            </div>
        </>
    );
}
