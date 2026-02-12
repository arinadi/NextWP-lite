import React from "react";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_SETTINGS } from "@/lib/site-settings";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
    const posts = await getPublishedPosts(10);

    return (
        <HomeClient
            posts={posts}
            settings={SITE_SETTINGS}
        />
    );
}
