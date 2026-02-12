"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/users/me")
            .then((r) => r.json())
            .then((data) => {
                setName(data.name || "");
                setEmail(data.email || "");
                setImage(data.image || "");
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await fetch("/api/users/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-gray-500" size={24} />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-light text-gray-100">Profile</h1>

            <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                    Your Profile
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-neutral-600" />
                        ) : (
                            <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center text-xl text-gray-400 border-2 border-neutral-600">
                                {(name || email || "U")[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-gray-200 font-medium">{name || "—"}</p>
                            <p className="text-gray-500 text-sm">{email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Display Name</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Email</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={email}
                                disabled
                                className="w-full bg-neutral-900 border border-neutral-700 text-gray-500 text-sm rounded px-3 py-1.5 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-600 mt-1">Email is managed by your OAuth provider.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-sm text-gray-400">Avatar URL</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 border-t border-neutral-700 bg-neutral-800 flex justify-end items-center gap-3">
                    {saved && <span className="text-green-400 text-xs">Profile updated!</span>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1.5 text-sm font-medium rounded border transition-colors bg-blue-600 border-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
