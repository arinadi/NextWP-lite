"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    postCount: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/categories");
            const data = await r.json();
            setCategories(data.data || []);
        } catch (e) {
            console.error("Fetch categories error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
            setName("");
            setDescription("");
            fetchCategories();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        fetchCategories();
    };

    const handleRename = async (id: string) => {
        if (!editName.trim()) return;
        await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editName }),
        });
        setEditingId(null);
        fetchCategories();
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-light text-gray-100">Categories</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Add New Category */}
                <div className="md:col-span-1">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 text-sm">Add New Category</div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Category name"
                                    className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional description"
                                    className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-2 h-20 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={saving || !name.trim()}
                                className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category List */}
                <div className="md:col-span-2">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin text-gray-500" size={24} />
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">No categories yet.</div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-neutral-900 text-gray-200 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Slug</th>
                                        <th className="p-3">Posts</th>
                                        <th className="p-3 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-700">
                                    {categories.map((cat) => (
                                        <tr
                                            key={cat.id}
                                            className="group hover:bg-neutral-750 transition-colors cursor-pointer"
                                            onDoubleClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                        >
                                            <td className="p-3">
                                                {editingId === cat.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && handleRename(cat.id)}
                                                            className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-2 py-0.5 w-32 focus:outline-none focus:border-blue-500"
                                                            autoFocus
                                                        />
                                                        <button onClick={() => handleRename(cat.id)} className="text-xs text-blue-400 hover:underline">Save</button>
                                                        <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className="text-blue-400 cursor-pointer hover:underline"
                                                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                                    >
                                                        {cat.name}
                                                    </span>
                                                )}
                                                {cat.description && <div className="text-xs text-gray-500 mt-0.5">{cat.description}</div>}
                                            </td>
                                            <td className="p-3 text-gray-500">{cat.slug}</td>
                                            <td className="p-3">{cat.postCount}</td>
                                            <td className="p-3">
                                                <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
