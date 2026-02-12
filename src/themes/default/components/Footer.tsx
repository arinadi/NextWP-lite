import React from "react";
import type { SiteSettings } from "@/types/theme";

interface FooterProps {
    settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
    return (
        <footer className="bg-white dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {settings.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                            A modern, serverless CMS built for performance and developer experience. Powered by Vercel and Neon.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            Navigation
                        </h3>
                        <ul className="space-y-2">
                            {settings.menus.primary.map((item) => (
                                <li key={item.url}>
                                    <a
                                        href={item.url}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            {settings.menus.footer.map((item) => (
                                <li key={item.url}>
                                    <a
                                        href={item.url}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            Connect
                        </h3>
                        <div className="flex gap-3">
                            {settings.socials?.twitter && (
                                <a
                                    href={settings.socials.twitter}
                                    className="w-10 h-10 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    aria-label="Twitter"
                                >
                                    𝕏
                                </a>
                            )}
                            {settings.socials?.github && (
                                <a
                                    href={settings.socials.github}
                                    className="w-10 h-10 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                                    aria-label="GitHub"
                                >
                                    GH
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} {settings.title}. All rights reserved.</p>
                    <p>
                        Designed with <span className="text-red-500">♥</span> by ATechAsync
                    </p>
                </div>
            </div>
        </footer>
    );
}
