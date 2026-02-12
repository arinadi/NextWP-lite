"use client";

import React from "react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-light text-gray-100">Settings</h1>

            {/* General Settings */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                    General Settings
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Site Title</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                defaultValue="NextWP-lite"
                                className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Tagline</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                defaultValue="Modern Serverless CMS"
                                className="w-full md:w-2/3 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Discussion Settings */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                    Discussion Settings
                </div>
                <div className="p-4 space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 accent-blue-600 w-4 h-4" defaultChecked />
                        <div>
                            <label className="text-sm text-gray-200 font-medium">
                                Allow people to submit comments on new posts
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                (These settings may be overridden for individual posts.)
                            </p>
                        </div>
                    </div>

                    <hr className="border-neutral-700" />

                    {/* Comment Provider Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="text-sm text-gray-400 pt-2">Comment Service</label>
                        <div className="md:col-span-2 space-y-4">
                            <select className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option value="giscus">Giscus (GitHub Discussions)</option>
                                <option value="disqus">Disqus</option>
                            </select>
                            <p className="text-xs text-gray-500">
                                Choose the external service to handle comments. Giscus is recommended for developer blogs (no tracking). Disqus is better for general audiences.
                            </p>
                        </div>
                    </div>

                    {/* Giscus Config */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="text-sm text-gray-400 pt-2">Giscus Configuration</label>
                        <div className="md:col-span-2 space-y-2">
                            <input
                                type="text"
                                placeholder="username/repo"
                                className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500">
                                Enter your GitHub repository (e.g., <code>atechasync/wpvite-comments</code>). Ensure the Giscus app is installed on the repo.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
                        <label className="text-sm text-gray-400 pt-2">Disqus Shortname</label>
                        <div className="md:col-span-2 space-y-2">
                            <input
                                type="text"
                                placeholder="example-site"
                                className="w-full md:w-1/2 bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5"
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 border-t border-neutral-700 bg-neutral-800 flex justify-end">
                    <button className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
