import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "NextWP-lite",
        short_name: "NextWP",
        description: "Modern Serverless CMS — Built with Next.js 16",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0c0c0e",
        theme_color: "#2563eb",
        icons: [
            {
                src: "/icons/icon-192.svg",
                sizes: "192x192",
                type: "image/svg+xml",
                purpose: "maskable",
            },
            {
                src: "/icons/icon-512.svg",
                sizes: "512x512",
                type: "image/svg+xml",
            },
        ],
    };
}
