"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import SingleTemplate from "@/themes/default/templates/Single";
import type { Post, SiteSettings } from "@/types/theme";

const SITE_SETTINGS: SiteSettings = {
    title: "NextWP-lite",
    tagline: "Modern Serverless CMS",
    logoUrl: undefined,
    menus: {
        primary: [
            { label: "Home", url: "/" },
            { label: "Features", url: "/features" },
            { label: "Blog", url: "/blog" },
            { label: "About", url: "/about" },
        ],
        footer: [
            { label: "Privacy Policy", url: "/privacy" },
            { label: "Terms of Service", url: "/tos" },
            { label: "Contact", url: "/contact" },
        ],
    },
    socials: { twitter: "#", github: "#" },
};

const MOCK_POSTS: Post[] = [
    {
        id: "1",
        title: "Membangun CMS Serverless dengan React & Next.js",
        slug: "membangun-cms-serverless",
        excerpt:
            "Panduan lengkap bagaimana kami merancang arsitektur NextWP-lite menggunakan Vercel Functions dan Neon Database untuk performa maksimal.",
        content: `
      <p>Serverless architecture telah mengubah cara kita membangun web. Tidak ada lagi server yang harus di-maintain 24/7, kita hanya membayar apa yang kita gunakan.</p>
      <h3>Kenapa Serverless?</h3>
      <p>Alasan utamanya adalah skalabilitas dan biaya. Dengan menggunakan <strong>Vercel Functions</strong>, aplikasi kita bisa menangani traffic spike tanpa konfigurasi load balancer manual.</p>
      <blockquote>"Fokus pada kode, bukan infrastruktur." - Filosofi Modern DevOps</blockquote>
      <h3>Stack Teknologi</h3>
      <ul>
        <li>Frontend: React + Next.js 16</li>
        <li>Database: Neon (PostgreSQL)</li>
        <li>ORM: Drizzle</li>
      </ul>
      <p>Arsitektur ini memungkinkan kita mencapai skor Lighthouse 100 karena konten di-render di server (SSR) dan dikirim sebagai HTML statis.</p>
    `,
        featuredImage:
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1000",
        author: { name: "Arinadi", avatar: "https://i.pravatar.cc/150?u=arinadi" },
        publishedAt: "2023-10-25T10:00:00Z",
        category: "Engineering",
        tags: ["Serverless", "React", "Vercel"],
    },
    {
        id: "2",
        title: "Masa Depan Web Development di 2026",
        slug: "masa-depan-web-dev",
        excerpt: "Trend terbaru dalam ekosistem JavaScript.",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        featuredImage:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000",
        author: { name: "Sarah Tech", avatar: "https://i.pravatar.cc/150?u=sarah" },
        publishedAt: "2023-10-20T08:30:00Z",
        category: "Trends",
        tags: ["JavaScript", "AI", "Future"],
    },
    {
        id: "3",
        title: "Optimasi SEO untuk Aplikasi React",
        slug: "seo-react-app",
        excerpt: "Mengapa CSR buruk untuk SEO dan bagaimana SSR menyelesaikan masalah tersebut.",
        content: "<p>Content SEO...</p>",
        featuredImage:
            "https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&q=80&w=1000",
        author: { name: "Admin", avatar: "https://i.pravatar.cc/150?u=admin" },
        publishedAt: "2023-10-15T14:15:00Z",
        category: "SEO",
        tags: ["Optimization", "Google"],
    },
    {
        id: "4",
        title: "Minimalism in UI Design",
        slug: "minimalism-ui",
        excerpt: "Less is more. How to declutter your interface.",
        content: "<p>Design content...</p>",
        featuredImage:
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
        author: { name: "Designer One", avatar: "https://i.pravatar.cc/150?u=design" },
        publishedAt: "2023-10-10T09:00:00Z",
        category: "Design",
        tags: ["UI/UX", "Minimalism"],
    },
];

export default function SlugPage() {
    const router = useRouter();
    const params = useParams();
    const slugParts = params.slug as string[];
    const slug = slugParts?.join("/") || "home";

    const post = MOCK_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return (
            <main className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center px-4 py-20">
                    <h1 className="text-8xl font-extrabold text-gray-200 dark:text-neutral-800 mb-4">404</h1>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        The page you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        ← Back to Home
                    </button>
                </div>
            </main>
        );
    }

    return (
        <SingleTemplate
            post={post}
            allPosts={MOCK_POSTS}
            settings={SITE_SETTINGS}
            onBack={() => router.push("/")}
            onPostClick={(p) => router.push(`/${p.slug}`)}
        />
    );
}
