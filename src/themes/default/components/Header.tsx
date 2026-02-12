"use client";

import React, { useState } from "react";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import type { SiteSettings } from "@/types/theme";

interface HeaderProps {
    settings: SiteSettings;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ settings, isDarkMode, toggleTheme }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                        W
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">
                            {settings.title}
                        </h1>
                        <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                            {settings.tagline}
                        </p>
                    </div>
                </Link>

                {/* Right Side: Nav + Search + Actions */}
                <div className="flex items-center gap-6 flex-grow justify-end">
                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {settings.menus.primary.map((item) => (
                            <Link
                                key={item.url}
                                href={item.url}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Search */}
                    <form
                        action="/search"
                        method="GET"
                        className="hidden md:flex relative group"
                    >
                        <input
                            type="text"
                            name="q"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-4 pr-10 py-1.5 bg-gray-100 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 w-48 transition-all group-hover:w-64"
                        />
                        <button type="submit" className="absolute right-3 top-1.5 text-gray-400 hover:text-blue-600">
                            <Search size={16} />
                        </button>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            className="p-2 text-gray-900 dark:text-white lg:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 p-4 shadow-xl z-50">
                    <form action="/search" method="GET" className="mb-4 relative md:hidden">
                        <input
                            type="text"
                            name="q"
                            placeholder="Search..."
                            className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-neutral-900 rounded-lg text-sm"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
                    </form>
                    <nav className="flex flex-col gap-4">
                        {settings.menus.primary.map((item) => (
                            <Link
                                key={item.url}
                                href={item.url}
                                className="text-lg font-medium text-gray-800 dark:text-gray-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
