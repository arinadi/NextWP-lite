"use client";

import React, { useState } from "react";
import {
    Plus,
    Bold,
    Italic,
    List,
    Heading,
    Link as LinkIcon,
    Image as ImageIcon,
    Save,
    Trash2,
    Settings2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamic import for the editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function EditorPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<any[]>([]);

    const handleSave = () => {
        console.log("Saving post:", { title, content });
        // TODO: Implement save logic
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-light tracking-tight">Edit Post</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Save className="size-4" />
                        Save Draft
                    </Button>
                    <Button size="sm" onClick={handleSave} className="gap-2">
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
                                initialContent={undefined}
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
                                <span className="font-semibold px-2 py-0.5 bg-muted rounded-full text-xs">Draft</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Visibility:</span>
                                <span className="font-semibold text-xs">Public</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center pt-1">
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 -ml-2">
                                    <Trash2 className="size-4 mr-2" />
                                    Move to Trash
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Panel */}
                    <Card>
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {["Uncategorized", "Technology", "Tutorial", "News", "Opinion"].map((cat) => (
                                    <label key={cat} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground cursor-pointer group">
                                        <input type="checkbox" className="size-4 rounded border-input bg-background accent-primary" />
                                        <span className="group-hover:translate-x-0.5 transition-transform">{cat}</span>
                                    </label>
                                ))}
                            </div>
                            <Button variant="link" size="sm" className="px-0 mt-3 text-primary h-auto">
                                + Add New Category
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Featured Image */}
                    <Card>
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="aspect-video bg-muted/50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-all group">
                                <ImageIcon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs">Set featured image</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">Post Options</CardTitle>
                            <Settings2 className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Plus className="size-4" />
                                <span>Advanced configurations...</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
