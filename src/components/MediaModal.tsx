"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Check } from "lucide-react";

interface MediaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string, alt: string) => void;
}

interface MediaItem {
    id: string;
    url: string;
    altText?: string;
    type: string;
}

export function MediaModal({ open, onOpenChange, onSelect }: MediaModalProps) {
    const [activeTab, setActiveTab] = useState("library");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Upload State
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState("");

    useEffect(() => {
        if (open && activeTab === "library") {
            fetchMedia();
        }
    }, [open, activeTab]);

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/media?limit=20");
            const data = await res.json();
            if (data.data) {
                setMediaItems(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch media", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;
        setIsUploading(true);

        try {
            const res = await fetch(`/api/media/upload?filename=${encodeURIComponent(uploadFile.name)}`, {
                method: "POST",
                body: uploadFile,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();

            // Switch to library and select the New Image
            setActiveTab("library");
            fetchMedia(); // Refresh list

            // Optionally auto-select?
            // For now just refresh locally

        } catch (error) {
            console.error("Upload error", error);
        } finally {
            setIsUploading(false);
            setUploadFile(null);
        }
    };

    const handleUrlInsert = () => {
        if (uploadUrl) {
            onSelect(uploadUrl, "");
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Insert Media</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 border-b bg-muted/40">
                        <TabsList className="h-12 bg-transparent p-0 gap-6">
                            <TabsTrigger
                                value="library"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-medium"
                            >
                                Media Library
                            </TabsTrigger>
                            <TabsTrigger
                                value="upload"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-medium"
                            >
                                Add New Media
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="library" className="flex-1 p-6 overflow-y-auto m-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">Loading media...</div>
                        ) : mediaItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                <ImageIcon className="size-10 opacity-20" />
                                <p>No media found</p>
                                <Button variant="outline" onClick={() => setActiveTab("upload")}>Upload New</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {mediaItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedMedia(item)}
                                        className={`relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer group ${selectedMedia?.id === item.id ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-transparent hover:border-muted-foreground/50"}`}
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.altText || "Media"}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        {selectedMedia?.id === item.id && (
                                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                                                <Check className="size-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upload" className="flex-1 p-8 m-0 flex flex-col items-center justify-center gap-6">

                        <div className="w-full max-w-md space-y-4">
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 flex flex-col items-center gap-4 text-center hover:bg-muted/50 transition-colors">
                                <Upload className="size-10 text-muted-foreground" />
                                <div>
                                    <h3 className="font-semibold text-lg">Upload Files</h3>
                                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                />
                                <Button asChild variant="secondary">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        Select File
                                    </label>
                                </Button>
                                {uploadFile && (
                                    <div className="text-sm font-medium text-primary">
                                        Selected: {uploadFile.name}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or insert from URL</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={uploadUrl}
                                    onChange={(e) => setUploadUrl(e.target.value)}
                                />
                            </div>
                        </div>

                    </TabsContent>

                    <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        {activeTab === "library" ? (
                            <Button
                                disabled={!selectedMedia}
                                onClick={() => {
                                    if (selectedMedia) {
                                        onSelect(selectedMedia.url, selectedMedia.altText || "");
                                        onOpenChange(false);
                                    }
                                }}
                            >
                                Insert Selected
                            </Button>
                        ) : (
                            uploadFile ? (
                                <Button onClick={handleUpload} disabled={isUploading}>
                                    {isUploading ? "Uploading..." : "Upload & Insert"}
                                </Button>
                            ) : (
                                <Button onClick={handleUrlInsert} disabled={!uploadUrl}>
                                    Insert from URL
                                </Button>
                            )
                        )}
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
