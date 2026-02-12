"use client";

import React from "react";
import { FileText, MessageSquare } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-light text-gray-100">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* At a Glance Widget */}
                <div className="col-span-1 md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-sm p-0 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 bg-neutral-800">
                        At a Glance
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <FileText size={16} /> <span>12 Posts</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <FileText size={16} /> <span>3 Pages</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <MessageSquare size={16} /> <span>45 Comments</span>
                            </div>
                            <div className="text-gray-500 text-sm">
                                NextWP-lite 1.0 running on Vercel
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Draft Widget */}
                <div className="col-span-1 md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 bg-neutral-800">
                        Quick Draft
                    </div>
                    <div className="p-4 space-y-3">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <textarea
                            className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-2 h-24 focus:outline-none focus:border-blue-500"
                            placeholder="What's on your mind?"
                        />
                        <button className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300 flex items-center gap-2">
                            Save Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
