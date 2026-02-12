"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
    Bold, Italic, Underline, Strikethrough,
    Heading1, Heading2, Heading3,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaModal } from "@/components/MediaModal";
import { useState } from "react";

interface EditorProps {
    onChange: (blocks: PartialBlock[]) => void;
    initialContent?: PartialBlock[];
    editable?: boolean;
}

const ToolbarButton = ({ onClick, icon: Icon, isActive }: { onClick: () => void, icon: any, isActive?: boolean }) => (
    <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={`h-8 w-8 p-0 hover:bg-muted/80 ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
    >
        <Icon className="size-4" />
    </Button>
);

const CustomToolbar = ({
    editor,
    activeStyles,
    activeBlockType,
    activeBlockLevel,
    activeAlignment,
    setIsMediaModalOpen
}: {
    editor: BlockNoteEditor | null,
    activeStyles: Record<string, string | boolean | undefined>,
    activeBlockType: string,
    activeBlockLevel?: number,
    activeAlignment: string,
    setIsMediaModalOpen: (open: boolean) => void
}) => {
    if (!editor) return null;

    const toggleStyle = (style: any) => {
        editor.toggleStyles(style);
        editor.focus();
    };

    const setBlockType = (type: any, props?: any) => {
        try {
            const currentBlock = editor.getTextCursorPosition().block;
            editor.updateBlock(currentBlock, { type, props });
            editor.focus();
        } catch (e) {
            console.error("Error updating block:", e);
        }
    };

    const setAlignment = (alignment: "left" | "center" | "right") => {
        try {
            const currentBlock = editor.getTextCursorPosition().block;
            editor.updateBlock(currentBlock, { props: { textAlignment: alignment } });
            editor.focus();
        } catch (e) {
            console.error("Error setting alignment:", e);
        }
    }

    const addImage = () => {
        setIsMediaModalOpen(true);
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border/40 bg-muted/20 backdrop-blur-md sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-0.5 p-1 bg-background/50 rounded-md border border-border/20 shadow-sm">
                <ToolbarButton icon={Bold} isActive={activeStyles.bold === true} onClick={() => toggleStyle({ bold: true })} />
                <ToolbarButton icon={Italic} isActive={activeStyles.italic === true} onClick={() => toggleStyle({ italic: true })} />
                <ToolbarButton icon={Underline} isActive={activeStyles.underline === true} onClick={() => toggleStyle({ underline: true })} />
                <ToolbarButton icon={Strikethrough} isActive={activeStyles.strike === true} onClick={() => toggleStyle({ strike: true })} />
            </div>

            <div className="w-px h-6 bg-border/40 mx-2" />

            <div className="flex items-center gap-0.5 p-1 bg-background/50 rounded-md border border-border/20 shadow-sm">
                <ToolbarButton icon={Heading1} isActive={activeBlockType === "heading" && activeBlockLevel === 1} onClick={() => setBlockType("heading", { level: 1 })} />
                <ToolbarButton icon={Heading2} isActive={activeBlockType === "heading" && activeBlockLevel === 2} onClick={() => setBlockType("heading", { level: 2 })} />
                <ToolbarButton icon={Heading3} isActive={activeBlockType === "heading" && activeBlockLevel === 3} onClick={() => setBlockType("heading", { level: 3 })} />
            </div>

            <div className="w-px h-6 bg-border/40 mx-2" />

            <div className="flex items-center gap-0.5 p-1 bg-background/50 rounded-md border border-border/20 shadow-sm">
                <ToolbarButton icon={List} isActive={activeBlockType === "bulletListItem"} onClick={() => setBlockType("bulletListItem")} />
                <ToolbarButton icon={ListOrdered} isActive={activeBlockType === "numberedListItem"} onClick={() => setBlockType("numberedListItem")} />
            </div>

            <div className="w-px h-6 bg-border/40 mx-2" />

            <div className="flex items-center gap-0.5 p-1 bg-background/50 rounded-md border border-border/20 shadow-sm">
                <ToolbarButton icon={AlignLeft} isActive={activeAlignment === "left"} onClick={() => setAlignment("left")} />
                <ToolbarButton icon={AlignCenter} isActive={activeAlignment === "center"} onClick={() => setAlignment("center")} />
                <ToolbarButton icon={AlignRight} isActive={activeAlignment === "right"} onClick={() => setAlignment("right")} />
            </div>

            <div className="w-px h-6 bg-border/40 mx-2" />

            <div className="flex items-center gap-0.5 p-1 bg-background/50 rounded-md border border-border/20 shadow-sm">
                <ToolbarButton icon={ImageIcon} onClick={addImage} />
            </div>
        </div>
    );
};

export default function Editor({ onChange, initialContent, editable = true }: EditorProps) {
    const [activeStyles, setActiveStyles] = useState<Record<string, string | boolean | undefined>>({});
    const [activeBlockType, setActiveBlockType] = useState<string>("paragraph");
    const [activeBlockLevel, setActiveBlockLevel] = useState<number>();
    const [activeAlignment, setActiveAlignment] = useState<string>("left");
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    // 1. Setup Editor
    const editor = useCreateBlockNote({
        initialContent,
        uploadFile: async (file: File) => {
            // Keep direct drag-and-drop support working via API
            const response = await fetch(`/api/media/upload?filename=${encodeURIComponent(file.name)}`, {
                method: "POST",
                body: file,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            return data.url;
        },
    });

    const handleMediaSelect = (url: string, alt: string) => {
        if (!editor) return;
        try {
            const currentBlock = editor.getTextCursorPosition().block;
            const isEmpty = !currentBlock.content || (Array.isArray(currentBlock.content) && currentBlock.content.length === 0);

            if (isEmpty) {
                editor.updateBlock(currentBlock, { type: "image", props: { url, caption: alt } });
            } else {
                editor.insertBlocks([{ type: "image", props: { url, caption: alt } }], currentBlock, "after");
            }
            editor.focus();
        } catch (e) {
            console.error("Error inserting image:", e);
        }
    };

    const updateActiveState = () => {
        if (!editor) return;
        try {
            // Get active styles (bold, italic, etc)
            setActiveStyles(editor.getActiveStyles());

            // Get active block type
            const block = editor.getTextCursorPosition().block;
            setActiveBlockType(block.type);

            // Get active block level if it's a heading
            if (block.type === "heading") {
                setActiveBlockLevel((block.props as any).level);
            } else {
                setActiveBlockLevel(undefined);
            }

            // Get active alignment
            setActiveAlignment((block.props as any).textAlignment || "left");

        } catch (e) {
            // Context might not be ready
            // console.log("Error updating state", e);
        }
    };

    // 2. Listen for changes
    return (
        <>
            <div className="w-full flex flex-col h-full rounded-xl border border-border/50 bg-card/50 text-card-foreground shadow-sm overflow-hidden backdrop-blur-sm transition-all duration-200 hover:border-border/80 hover:shadow-md">
                <CustomToolbar
                    editor={editor}
                    activeStyles={activeStyles}
                    activeBlockType={activeBlockType}
                    activeBlockLevel={activeBlockLevel}
                    activeAlignment={activeAlignment}
                    setIsMediaModalOpen={setIsMediaModalOpen}
                />
                <div className="flex-1 overflow-y-auto cursor-text px-4 md:px-8 py-6" onClick={() => editor?.focus()}>
                    <BlockNoteView
                        editor={editor}
                        editable={editable}
                        onChange={() => {
                            onChange(editor.document);
                            updateActiveState();
                        }}
                        onSelectionChange={updateActiveState}
                        theme="dark"
                        formattingToolbar={false} // Disable default floating toolbar
                        className="min-h-full"
                    />
                </div>
            </div>

            <MediaModal
                open={isMediaModalOpen}
                onOpenChange={setIsMediaModalOpen}
                onSelect={handleMediaSelect}
            />
        </>
    );
}
