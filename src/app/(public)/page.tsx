import React from "react";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import HomeClient from "@/components/HomeClient";
import { getOptions } from "@/lib/options";

export async function generateMetadata(): Promise<Metadata> {
    const opts = await getOptions(["site_title", "site_tagline"]);
    const title = opts.site_title || "NextWP-lite";
    const tagline = opts.site_tagline || "Modern Serverless CMS";

    return {
        title: `${title} — ${tagline}`,
        description: tagline,
    };
}

export default async function HomePage() {
    const posts = await getPublishedPosts(10);
    const opts = await getOptions(["site_title", "site_tagline", "site_menus"]);

    const dynamicSettings = {
        title: opts.site_title || "NextWP-lite",
        tagline: opts.site_tagline || "Modern Serverless CMS",
        menus: opts.site_menus || { primary: [], footer: [] },
    };

    return (
        <HomeClient
            posts={posts}
            settings={dynamicSettings}
        />
    );
}
