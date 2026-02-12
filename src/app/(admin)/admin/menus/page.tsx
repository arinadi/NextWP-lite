"use client";

import React from "react";

export default function MenusPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-light text-gray-100">Menus</h1>

            <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-sm flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-400">Select a menu to edit:</span>
                <select className="bg-neutral-900 text-gray-300 border border-neutral-700 text-sm p-1 rounded w-48">
                    <option>Main Menu (Primary)</option>
                    <option>Footer Menu</option>
                </select>
                <button className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300">
                    Select
                </button>
                <span className="text-sm text-gray-400 ml-4">
                    or{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                        create a new menu
                    </a>
                    .
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Add Items */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-neutral-800 border border-neutral-700">
                        <div className="flex justify-between items-center p-3 bg-neutral-800 border-b border-neutral-700">
                            <span className="font-semibold text-sm text-gray-300">Pages</span>
                        </div>
                        <div className="p-3 bg-neutral-900">
                            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                <label className="flex items-center gap-2 text-sm text-gray-400">
                                    <input type="checkbox" className="accent-blue-600" /> Home
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-400">
                                    <input type="checkbox" className="accent-blue-600" /> About
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-400">
                                    <input type="checkbox" className="accent-blue-600" /> Contact
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-400">
                                    <input type="checkbox" className="accent-blue-600" /> Blog
                                </label>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-neutral-700">
                                <button className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300">
                                    Add to Menu
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-800 border border-neutral-700">
                        <div className="flex justify-between items-center p-3 bg-neutral-800 border-b border-neutral-700">
                            <span className="font-semibold text-sm text-gray-300">Custom Links</span>
                        </div>
                        <div className="p-3 bg-neutral-900 space-y-2">
                            <input
                                type="text"
                                placeholder="URL"
                                className="w-full bg-neutral-800 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Link Text"
                                className="w-full bg-neutral-800 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                            />
                            <button className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300">
                                Add to Menu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Menu Structure */}
                <div className="md:col-span-2">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                        <div className="bg-neutral-800 p-3 border-b border-neutral-700 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-300">Menu Name</span>
                                <input
                                    type="text"
                                    defaultValue="Main Menu"
                                    className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1 w-40 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button className="px-3 py-1 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500">
                                Save Menu
                            </button>
                        </div>
                        <div className="p-4 bg-neutral-900 min-h-[300px] space-y-2">
                            {/* Mock menu items */}
                            {["Home", "Features", "Blog", "About"].map((item, i) => (
                                <div key={item} className={`bg-neutral-800 border border-neutral-700 p-3 rounded flex justify-between items-center ${i > 1 ? "ml-6" : ""}`}>
                                    <span className="text-sm text-gray-300">{item}</span>
                                    <span className="text-xs text-gray-500">Page</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
