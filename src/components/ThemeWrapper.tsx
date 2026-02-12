"use client";

import React, { useState, useEffect } from "react";
import type { SiteSettings } from "@/types/theme";

interface ThemeWrapperProps {
    children: React.ReactNode;
    header: React.ComponentType<any>;
    footer: React.ComponentType<any>;
    settings: SiteSettings;
}

export default function ThemeWrapper({
    children,
    header: Header,
    footer: Footer,
    settings,
}: ThemeWrapperProps) {
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
                settings={settings}
                isDarkMode={isDarkMode}
                toggleTheme={() => setIsDarkMode(!isDarkMode)}
            />
            {children}
            <Footer settings={settings} />
        </div>
    );
}
