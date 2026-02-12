"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Upload, Trash2, X, Link as LinkIcon } from "lucide-react";

interface MediaItem {
    id: string;
    url: string;
    type: string;
    altText: string | null;
    size: number | null;
    uploadedAt: string;
}

export default function MediaPage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // URL import state
    const [showUrlForm, setShowUrlForm] = useState(false);
    const [importUrl, setImportUrl] = useState("");
    const [importName, setImportName] = useState("");
    const [importing, setImporting] = useState(false);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/media");
            const data = await r.json();
            setMediaItems(data.data || []);
        } catch (e) {
            console.error("Fetch media error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            for (const file of Array.from(files)) {
                await fetch(`/api/media/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: "POST",
                    body: file,
                });
            }
            fetchMedia();
        } catch (e) {
            console.error("Upload error:", e);
        } finally {
            setUploading(false);
        }
    };

    // Auto-fill name from URL
    const handleUrlChange = (url: string) => {
        setImportUrl(url);
        if (!importName) {
            try {
                const filename = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "");
                if (filename) setImportName(filename);
            } catch { /* ignore */ }
        }
    };

    const handleImportUrl = async () => {
        if (!importUrl.trim()) return;
        setImporting(true);
        try {
            const r = await fetch("/api/media/url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: importUrl, name: importName || undefined }),
            });
            if (r.ok) {
                setImportUrl("");
                setImportName("");
                setShowUrlForm(false);
                fetchMedia();
            }
        } catch (e) {
            console.error("Import URL error:", e);
        } finally {
            setImporting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this media item?")) return;
        await fetch(`/api/media?id=${id}`, { method: "DELETE" });
        setSelected(null);
        fetchMedia();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
    };

    const formatSize = (bytes: number | null) => {
        if (!bytes) return "—";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-light text-gray-100">Media Library</h1>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 flex items-center gap-1"
                >
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    Upload File
                </button>
                <button
                    onClick={() => setShowUrlForm(!showUrlForm)}
                    className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 flex items-center gap-1"
                >
                    <LinkIcon size={12} />
                    Add from URL
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files)}
                />
            </div>

            {/* URL Import Form */}
            {showUrlForm && (
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">URL</label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={importUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Name (auto-filled from URL)</label>
                            <input
                                type="text"
                                placeholder="my-image.jpg"
                                value={importName}
                                onChange={(e) => setImportName(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleImportUrl}
                            disabled={importing || !importUrl.trim()}
                            className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                        >
                            {importing ? <Loader2 size={14} className="animate-spin" /> : <LinkIcon size={14} />}
                            Import
                        </button>
                        <button
                            onClick={() => { setShowUrlForm(false); setImportUrl(""); setImportName(""); }}
                            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {/* Upload Placeholder */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-neutral-700 rounded bg-neutral-800 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 cursor-pointer group"
                    >
                        <Upload size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                        <span className="text-xs font-medium text-center px-1">Drop files to upload</span>
                    </div>

                    {mediaItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelected(item)}
                            className={`relative aspect-square bg-neutral-800 border cursor-pointer group overflow-hidden ${selected?.id === item.id ? "border-blue-500 border-2" : "border-neutral-700"}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.url} alt={item.altText || ""} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.altText || item.url.split("/").pop()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Panel */}
            {selected && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-200">Media Details</h2>
                            <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-200"><X size={20} /></button>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selected.url} alt="" className="w-full max-h-64 object-contain rounded bg-neutral-900" />
                        <div className="text-sm space-y-1 text-gray-400">
                            {selected.altText && <p><span className="text-gray-300">Name:</span> {selected.altText}</p>}
                            <p><span className="text-gray-300">URL:</span> <a href={selected.url} target="_blank" className="text-blue-400 hover:underline break-all">{selected.url}</a></p>
                            <p><span className="text-gray-300">Type:</span> {selected.type}</p>
                            <p><span className="text-gray-300">Size:</span> {formatSize(selected.size)}</p>
                            <p><span className="text-gray-300">Uploaded:</span> {new Date(selected.uploadedAt).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(selected.id)}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                        >
                            <Trash2 size={14} /> Delete permanently
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
