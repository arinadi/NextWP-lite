"use client";

import React, { useState, useEffect } from "react";
import {
    Image as ImageIcon,
    Save,
    Trash2,
    Settings2,
    Loader2,
    Plus,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dynamic import for the editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
import { MediaModal } from "@/components/MediaModal";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function EditorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const postId = searchParams.get("id");
    const postType = searchParams.get("type") || "post";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState<any[]>([]);
    const [status, setStatus] = useState("draft");
    const [featuredImage, setFeaturedImage] = useState("");
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(!!postId);
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");
    const [mediaModalOpen, setMediaModalOpen] = useState(false);

    // Load categories
    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => setCategories(data.data || []))
            .catch(console.error);
    }, []);

    // Load existing post if editing
    useEffect(() => {
        if (!postId) return;
        setLoading(true);
        fetch(`/api/posts/${postId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.post) {
                    setTitle(data.post.title || "");
                    setContent(Array.isArray(data.post.content) ? data.post.content : []);
                    setStatus(data.post.status || "draft");
                    setFeaturedImage(data.post.featuredImage || "");
                    setCategoryId(data.post.categoryId || null);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [postId]);

    const handleSave = async (targetStatus: string) => {
        if (!title.trim()) return;
        setSaving(true);
        setSavedMessage("");
        try {
            const body = {
                title,
                content,
                status: targetStatus,
                type: postType,
                featuredImage: featuredImage || null,
                categoryId,
            };

            let result;
            if (postId) {
                // Update existing
                const r = await fetch(`/api/posts/${postId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                result = await r.json();
            } else {
                // Create new
                const r = await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                result = await r.json();
                // Redirect to edit mode with new ID
                if (result.id) {
                    router.replace(`/admin/posts/editor?id=${result.id}&type=${postType}`);
                }
            }

            setSavedMessage(targetStatus === "published" ? "Published!" : "Draft saved!");
            setStatus(targetStatus);
            setTimeout(() => setSavedMessage(""), 3000);
        } catch (e) {
            console.error("Save error:", e);
            setSavedMessage("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleTrash = async () => {
        if (!postId) return;
        if (!confirm("Move to trash?")) return;
        await fetch(`/api/posts/${postId}`, { method: "DELETE" });
        router.push(postType === "page" ? "/admin/pages" : "/admin/posts");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-gray-500" size={24} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-light tracking-tight">
                    {postId ? "Edit" : "New"} {postType === "page" ? "Page" : "Post"}
                </h1>
                <div className="flex items-center gap-2">
                    {savedMessage && <span className="text-green-400 text-xs">{savedMessage}</span>}
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleSave("draft")} disabled={saving || !title.trim()}>
                        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        Save Draft
                    </Button>
                    <Button size="sm" onClick={() => handleSave("published")} disabled={saving || !title.trim()} className="gap-2">
                        {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                        Publish
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-5xl font-extrabold tracking-tight bg-transparent border-none px-6 lg:px-12 py-6 mb-8 placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                        placeholder="Add title"
                    />

                    <div className="flex-1 bg-background border rounded-lg overflow-hidden shadow-sm flex flex-col">
                        <ScrollArea className="flex-1 p-6 lg:p-12">
                            <Editor
                                initialContent={content.length > 0 ? content : undefined}
                                onChange={(blocks) => setContent(blocks)}
                            />
                        </ScrollArea>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-6 overflow-y-auto pb-8">
                    {/* Publish Panel */}
                    <Card>
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${status === "published" ? "bg-green-600/20 text-green-400" : "bg-muted"}`}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Visibility:</span>
                                <span className="font-semibold text-xs">Public</span>
                            </div>
                            <Separator />
                            {postId && (
                                <div className="flex justify-between items-center pt-1">
                                    <Button variant="ghost" size="sm" onClick={handleTrash} className="text-destructive hover:text-destructive hover:bg-destructive/10 -ml-2">
                                        <Trash2 className="size-4 mr-2" />
                                        Move to Trash
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Categories Panel (only for posts) */}
                    {postType === "post" && (
                        <Card>
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {categories.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">No categories yet.</p>
                                    ) : (
                                        categories.map((cat) => (
                                            <label key={cat.id} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={categoryId === cat.id}
                                                    onChange={() => setCategoryId(cat.id)}
                                                    className="size-4 accent-primary"
                                                />
                                                <span className="group-hover:translate-x-0.5 transition-transform">{cat.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Featured Image */}
                    <Card>
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Featured Image</CardTitle>
                            {featuredImage && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => setFeaturedImage("")}
                                >
                                    <Trash2 className="size-3" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                            {featuredImage ? (
                                <div
                                    className="relative aspect-video rounded-lg overflow-hidden border bg-muted cursor-pointer group"
                                    onClick={() => setMediaModalOpen(true)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={featuredImage} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">Replace Image</span>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full h-24 border-dashed border-2 flex flex-col gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50"
                                    onClick={() => setMediaModalOpen(true)}
                                >
                                    <ImageIcon className="size-6 opacity-50" />
                                    <span className="text-xs">Set Featured Image</span>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <MediaModal
                        open={mediaModalOpen}
                        onOpenChange={setMediaModalOpen}
                        onSelect={(url) => setFeaturedImage(url)}
                    />
                </div>
            </div>
        </div>
    );
}
