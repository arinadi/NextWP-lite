"use client";

import React, { useState, useEffect } from "react";
import Header from "@/themes/default/components/Header";
import Footer from "@/themes/default/components/Footer";
import type { SiteSettings } from "@/types/theme";

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

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div className={`font-sans antialiased text-gray-900 dark:text-white`}>
            <Header
                settings={SITE_SETTINGS}
                isDarkMode={isDarkMode}
                toggleTheme={() => setIsDarkMode(!isDarkMode)}
            />
            {children}
            <Footer settings={SITE_SETTINGS} />
        </div>
    );
}
