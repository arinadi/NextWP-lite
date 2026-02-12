import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { SITE_SETTINGS } from "@/lib/site-settings";
import SingleClient from "@/components/SingleClient";
import Comments from "@/components/Comments";

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

    return {
        title: post.title,
        description: post.excerpt || `Read ${post.title} on NextWP-lite`,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: "article",
            ...(post.featuredImage && {
                images: [{ url: post.featuredImage }],
            }),
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || undefined,
            ...(post.featuredImage && {
                images: [post.featuredImage],
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
