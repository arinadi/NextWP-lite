import React from "react";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_SETTINGS } from "@/lib/site-settings";
import HomeClient from "@/components/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `${SITE_SETTINGS.title} — ${SITE_SETTINGS.tagline}`,
        description: SITE_SETTINGS.tagline,
    };
}
export default async function HomePage() {
    const posts = await getPublishedPosts(10);

    return (
        <HomeClient
            posts={posts}
            settings={SITE_SETTINGS}
        />
    );
}
