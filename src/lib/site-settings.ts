import type { SiteSettings } from "@/types/theme";

export const SITE_SETTINGS: SiteSettings = {
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
