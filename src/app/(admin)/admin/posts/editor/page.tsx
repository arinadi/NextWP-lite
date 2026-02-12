"use client";

import React from "react";
import {
    Plus,
    Bold,
    Italic,
    List,
    Heading,
    Link as LinkIcon,
    Image as ImageIcon,
} from "lucide-react";

export default function EditorPage() {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-light text-gray-100">Edit Post</h1>
            </div>

            <div className="flex gap-6 h-full">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                    <input
                        type="text"
                        className="text-3xl font-bold bg-neutral-900 border-none px-4 py-3 placeholder-gray-600 text-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Add title"
                    />

                    {/* Editor Toolbar */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-t-md p-2 flex gap-2 sticky top-0 z-10">
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Plus size={18} /></button>
                        <div className="w-px h-6 bg-neutral-700 mx-1" />
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Bold size={18} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Italic size={18} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><LinkIcon size={18} /></button>
                        <div className="w-px h-6 bg-neutral-700 mx-1" />
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Heading size={18} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><List size={18} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><ImageIcon size={18} /></button>
                    </div>

                    {/* Editor Body */}
                    <div className="bg-neutral-900 border border-neutral-700 border-t-0 rounded-b-md p-8 min-h-[500px] text-gray-300 font-serif text-lg leading-relaxed cursor-text">
                        <p className="mb-4">
                            Welcome to the new editing experience. Use{" "}
                            <code className="bg-neutral-800 px-1 rounded text-sm text-blue-300">/</code>{" "}
                            to trigger the command menu.
                        </p>
                        <p className="mb-4 text-gray-500 italic">
                            Start writing or type &apos;/&apos; to choose a block
                        </p>

                        <div className="border border-blue-500/30 bg-blue-500/10 p-4 rounded my-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-gray-400">
                                <ImageIcon size={16} />
                            </div>
                            <span className="text-gray-400 text-sm">Image block placeholder</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
                    {/* Publish Panel */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                        <div className="px-3 py-2 border-b border-neutral-700 font-medium text-sm text-gray-200">Publish</div>
                        <div className="p-3 space-y-3 text-sm text-gray-400">
                            <div className="flex justify-between items-center">
                                <span>Status:</span>
                                <span className="font-bold text-gray-200">Draft</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Visibility:</span>
                                <span className="font-bold text-gray-200">Public</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Revisions:</span>
                                <span className="font-bold text-gray-200">3</span>
                            </div>
                        </div>
                        <div className="px-3 py-2 border-t border-neutral-700 bg-neutral-800/50 flex justify-between items-center">
                            <button className="text-red-400 text-sm hover:underline">Move to Trash</button>
                            <button className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500">
                                Publish
                            </button>
                        </div>
                    </div>

                    {/* Categories Panel */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                        <div className="px-3 py-2 border-b border-neutral-700 font-medium text-sm text-gray-200">Categories</div>
                        <div className="p-3 max-h-40 overflow-y-auto space-y-2">
                            {["Uncategorized", "Technology", "Tutorial", "News", "Opinion"].map((cat) => (
                                <label key={cat} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                                    <input type="checkbox" className="accent-blue-600 rounded bg-neutral-700 border-neutral-600" />
                                    {cat}
                                </label>
                            ))}
                        </div>
                        <div className="px-3 py-2 border-t border-neutral-700">
                            <button className="text-blue-400 text-sm underline flex items-center gap-1">+ Add New Category</button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                        <div className="px-3 py-2 border-b border-neutral-700 font-medium text-sm text-gray-200">Featured Image</div>
                        <div className="p-3">
                            <div className="bg-neutral-900 border-2 border-dashed border-neutral-700 rounded h-32 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 cursor-pointer transition-colors">
                                <ImageIcon size={24} className="mb-2" />
                                <span className="text-xs">Set featured image</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
