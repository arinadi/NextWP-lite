"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HomeTemplate from "@/themes/default/templates/Home";
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
        author: {
            name: "Arinadi",
            avatar: "https://i.pravatar.cc/150?u=arinadi",
        },
        publishedAt: "2023-10-25T10:00:00Z",
        category: "Engineering",
        tags: ["Serverless", "React", "Vercel"],
    },
    {
        id: "2",
        title: "Masa Depan Web Development di 2026",
        slug: "masa-depan-web-dev",
        excerpt:
            "Trend terbaru dalam ekosistem JavaScript, pergeseran dari SPA ke Hybrid Rendering, dan kebangkitan AI dalam coding.",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        featuredImage:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000",
        author: {
            name: "Sarah Tech",
            avatar: "https://i.pravatar.cc/150?u=sarah",
        },
        publishedAt: "2023-10-20T08:30:00Z",
        category: "Trends",
        tags: ["JavaScript", "AI", "Future"],
    },
    {
        id: "3",
        title: "Optimasi SEO untuk Aplikasi React",
        slug: "seo-react-app",
        excerpt:
            "Mengapa Client-Side Rendering (CSR) buruk untuk SEO dan bagaimana Server-Side Rendering (SSR) menyelesaikan masalah tersebut.",
        content: "<p>Content SEO...</p>",
        featuredImage:
            "https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&q=80&w=1000",
        author: {
            name: "Admin",
            avatar: "https://i.pravatar.cc/150?u=admin",
        },
        publishedAt: "2023-10-15T14:15:00Z",
        category: "SEO",
        tags: ["Optimization", "Google"],
    },
    {
        id: "4",
        title: "Minimalism in UI Design",
        slug: "minimalism-ui",
        excerpt:
            "Less is more. How to declutter your interface and focus on what matters most for your users.",
        content: "<p>Design content...</p>",
        featuredImage:
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
        author: {
            name: "Designer One",
            avatar: "https://i.pravatar.cc/150?u=design",
        },
        publishedAt: "2023-10-10T09:00:00Z",
        category: "Design",
        tags: ["UI/UX", "Minimalism"],
    },
];

export default function HomePage() {
    const router = useRouter();

    const handlePostClick = (post: Post) => {
        router.push(`/${post.slug}`);
    };

    return (
        <HomeTemplate
            posts={MOCK_POSTS}
            settings={SITE_SETTINGS}
            onPostClick={handlePostClick}
        />
    );
}
