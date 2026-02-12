"use client";

import React from "react";
import { LayoutDashboard, List, Upload } from "lucide-react";

const MOCK_MEDIA = [
    { id: 1, url: "https://placehold.co/150x150/222/white?text=Img1", name: "hero-bg.jpg" },
    { id: 2, url: "https://placehold.co/150x150/333/white?text=Img2", name: "logo.png" },
    { id: 3, url: "https://placehold.co/150x150/444/white?text=Img3", name: "screenshot.jpg" },
    { id: 4, url: "https://placehold.co/150x150/555/white?text=Img4", name: "avatar.png" },
    { id: 5, url: "https://placehold.co/150x150/666/white?text=Img5", name: "banner.png" },
    { id: 6, url: "https://placehold.co/150x150/777/white?text=Img6", name: "icon.svg" },
];

export default function MediaPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-light text-gray-100">Media Library</h1>
                <button className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500">
                    Add New
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-800 p-2 rounded-sm border border-neutral-700">
                <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-200"><LayoutDashboard size={18} /></button>
                    <button className="p-1 text-gray-500 hover:text-gray-200"><List size={18} /></button>
                    <div className="w-px h-4 bg-neutral-600 mx-2" />
                    <select className="bg-neutral-900 text-gray-300 border border-neutral-700 text-xs p-1 rounded">
                        <option>All media items</option>
                        <option>Images</option>
                        <option>Audio</option>
                    </select>
                    <select className="bg-neutral-900 text-gray-300 border border-neutral-700 text-xs p-1 rounded">
                        <option>All dates</option>
                        <option>October 2023</option>
                    </select>
                    <button className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300">
                        Bulk Select
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search media items..."
                    className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {/* Upload Placeholder */}
                <div className="aspect-square border-2 border-dashed border-neutral-700 rounded bg-neutral-800 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 cursor-pointer group">
                    <Upload size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-xs font-medium">Drop files to upload</span>
                </div>

                {MOCK_MEDIA.map((media) => (
                    <div key={media.id} className="relative aspect-square bg-neutral-800 border border-neutral-700 cursor-pointer group overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 border-4 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {media.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
