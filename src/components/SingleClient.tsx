"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SingleTemplate from "@/themes/default/templates/Single";
import type { Post, SiteSettings } from "@/types/theme";

interface SingleClientProps {
    post: Post;
    allPosts: Post[];
    settings: SiteSettings;
}

export default function SingleClient({
    post,
    allPosts,
    settings,
}: SingleClientProps) {
    const router = useRouter();

    return (
        <SingleTemplate
            post={post}
            allPosts={allPosts}
            settings={settings}
            onBack={() => router.push("/")}
            onPostClick={(p: Post) => router.push(`/${p.slug}`)}
        />
    );
}
