"use client";

import React, { useEffect, useState } from "react";
import {
    Loader2, Plus, Trash2, Home, FileText, Mail, Info, BookOpen, Search,
    ShoppingCart, Heart, Star, Bell, User, Settings, Globe, Camera, Music,
    Video, Phone, MapPin, Calendar, Clock, Link as LinkIcon, Hash,
    Bookmark, Rss, Coffee, Zap, Shield, Award, Gift, Image as ImageIcon,
    MessageCircle, Send, Tag, Folder, Archive, Database, Cloud, Download,
    Upload, Eye, EyeOff, ChevronUp, ChevronDown, Type, LayoutDashboard,
    Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Twitch,
    Dribbble, Figma, Slack, Monitor, Smartphone, Tablet, Pencil, GripVertical
} from "lucide-react";

// Available icons for menu items (subset of Lucide for consistency)
const ICON_OPTIONS: Record<string, React.ComponentType<any>> = {
    home: Home, file: FileText, mail: Mail, info: Info, book: BookOpen,
    search: Search, cart: ShoppingCart, heart: Heart, star: Star, bell: Bell,
    user: User, settings: Settings, globe: Globe, camera: Camera, music: Music,
    video: Video, phone: Phone, map: MapPin, calendar: Calendar, clock: Clock,
    link: LinkIcon, hash: Hash, bookmark: Bookmark, rss: Rss, coffee: Coffee,
    zap: Zap, shield: Shield, award: Award, gift: Gift, image: ImageIcon,
    chat: MessageCircle, send: Send, tag: Tag, folder: Folder, archive: Archive,
    database: Database, cloud: Cloud, download: Download, upload: Upload,
    dashboard: LayoutDashboard,
    // Social & Devices
    facebook: Facebook, twitter: Twitter, instagram: Instagram, linkedin: Linkedin,
    github: Github, youtube: Youtube, twitch: Twitch, dribbble: Dribbble,
    figma: Figma, slack: Slack, monitor: Monitor, smartphone: Smartphone,
    tablet: Tablet,
};

interface MenuItem {
    id: string;
    label: string;
    url: string;
    type: "page" | "custom";
    icon?: string;
    showIcon?: boolean;
    showText?: boolean;
}

interface MenuData {
    primary: MenuItem[];
    footer: MenuItem[];
}

export default function MenusPage() {
    const [menuData, setMenuData] = useState<MenuData>({ primary: [], footer: [] });
    const [activeMenu, setActiveMenu] = useState<"primary" | "footer">("primary");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Custom link form
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");

    // Expanded item for editing icon
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/options/site_menus");
            const data = await r.json();
            if (data.value) {
                // Ensure all items have showIcon/showText defaults
                const normalized = { ...data.value } as MenuData;
                for (const key of ["primary", "footer"] as const) {
                    normalized[key] = (normalized[key] || []).map((item: MenuItem) => ({
                        ...item,
                        showIcon: item.showIcon ?? true,
                        showText: item.showText ?? true,
                    }));
                }
                setMenuData(normalized);
            }
        } catch (e) {
            console.error("Fetch menus error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const currentItems = menuData[activeMenu] || [];

    const saveMenus = async (updated: MenuData) => {
        setSaving(true);
        try {
            await fetch("/api/options/site_menus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: updated }),
            });
            setMenuData(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            console.error("Save menus error:", e);
        } finally {
            setSaving(false);
        }
    };

    const addCustomLink = () => {
        if (!linkUrl.trim() || !linkText.trim()) return;
        const item: MenuItem = {
            id: Date.now().toString(36),
            label: linkText,
            url: linkUrl.startsWith("http") ? linkUrl : `/${linkUrl}`,
            type: "custom",
            icon: "link",
            showIcon: true,
            showText: true,
        };
        const updated = { ...menuData, [activeMenu]: [...currentItems, item] };
        saveMenus(updated);
        setLinkUrl("");
        setLinkText("");
    };

    const addPageLink = (label: string) => {
        const iconMap: Record<string, string> = {
            Home: "home", About: "info", Contact: "mail", Blog: "book",
        };
        const item: MenuItem = {
            id: Date.now().toString(36) + label,
            label,
            url: `/${label.toLowerCase()}`,
            type: "page",
            icon: iconMap[label] || "file",
            showIcon: true,
            showText: true,
        };
        const updated = { ...menuData, [activeMenu]: [...currentItems, item] };
        saveMenus(updated);
    };

    const removeItem = (id: string) => {
        const updated = { ...menuData, [activeMenu]: currentItems.filter((i) => i.id !== id) };
        saveMenus(updated);
    };

    const moveItem = (index: number, direction: "up" | "down") => {
        const items = [...menuData[activeMenu]];
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= items.length) return;
        [items[index], items[target]] = [items[target], items[index]];
        setMenuData({ ...menuData, [activeMenu]: items });
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Ghost image styling
        const target = e.target as HTMLElement;
        target.style.opacity = "0.4";
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = "1";
        setDraggedIndex(null);
        // Save the new order after drag ends
        saveMenus(menuData);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const items = [...menuData[activeMenu]];
        const draggedItem = items[draggedIndex];
        items.splice(draggedIndex, 1);
        items.splice(index, 0, draggedItem);

        setDraggedIndex(index); // Update draggedIndex to reflect new position
        setMenuData({ ...menuData, [activeMenu]: items });
    };

    const updateItemField = (id: string, field: keyof MenuItem, value: any) => {
        const items = currentItems.map((item) => {
            if (item.id !== id) return item;
            const updated = { ...item, [field]: value };
            // Ensure at least one of showIcon/showText is true
            if (field === "showIcon" && !value && !updated.showText) {
                updated.showText = true;
            }
            if (field === "showText" && !value && !updated.showIcon) {
                updated.showIcon = true;
            }
            return updated;
        });
        const updated = { ...menuData, [activeMenu]: items };
        saveMenus(updated);
    };

    const renderIconComponent = (iconName: string | undefined, size: number = 14) => {
        if (!iconName) return null;
        const Icon = ICON_OPTIONS[iconName];
        if (!Icon) return null;
        return <Icon size={size} />;
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-light text-gray-100">Menus</h1>

            <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-sm flex flex-wrap items-center gap-4 mb-6">
                <span className="text-sm text-gray-400">Select a menu to edit:</span>
                <select
                    value={activeMenu}
                    onChange={(e) => setActiveMenu(e.target.value as "primary" | "footer")}
                    className="bg-neutral-900 text-gray-300 border border-neutral-700 text-sm p-1 rounded w-48"
                >
                    <option value="primary">Main Menu (Primary)</option>
                    <option value="footer">Footer Menu</option>
                </select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Add Items */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-neutral-800 border border-neutral-700">
                            <div className="flex justify-between items-center p-3 bg-neutral-800 border-b border-neutral-700">
                                <span className="font-semibold text-sm text-gray-300">Pages</span>
                            </div>
                            <div className="p-3 bg-neutral-900 space-y-2">
                                {["Home", "About", "Contact", "Blog"].map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => addPageLink(page)}
                                        className="w-full text-left flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 py-1 transition-colors"
                                    >
                                        <Plus size={12} /> {page}
                                    </button>
                                ))}
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
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="w-full bg-neutral-800 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Link Text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCustomLink()}
                                    className="w-full bg-neutral-800 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={addCustomLink}
                                    disabled={!linkUrl.trim() || !linkText.trim()}
                                    className="px-2 py-1 text-xs font-medium rounded border transition-colors bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300 disabled:opacity-50"
                                >
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
                                    <span className="text-sm font-medium text-gray-300">
                                        {activeMenu === "primary" ? "Main Menu" : "Footer Menu"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {saved && <span className="text-green-400 text-xs">Saved!</span>}
                                    {saving && <Loader2 size={14} className="animate-spin text-gray-500" />}
                                </div>
                            </div>
                            <div className="p-4 bg-neutral-900 min-h-[300px] space-y-2">
                                {currentItems.length === 0 ? (
                                    <div className="text-center text-gray-500 text-sm py-8">Add menu items from the left panel.</div>
                                ) : (
                                    currentItems.map((item, i) => (
                                        <div
                                            key={item.id}
                                            className={`bg-neutral-800 border border-neutral-700 rounded group transition-all ${draggedIndex === i ? "opacity-40 ring-1 ring-blue-500" : ""}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, i)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => handleDragOver(e, i)}
                                        >
                                            {/* Main row */}
                                            <div className="p-3 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400">
                                                        <GripVertical size={16} />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {item.showIcon !== false && item.icon && (
                                                            <span className="text-blue-400">{renderIconComponent(item.icon, 16)}</span>
                                                        )}
                                                        {item.showText !== false && (
                                                            <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                                                        )}

                                                        <button
                                                            onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                                                            className={`p-1 rounded hover:bg-neutral-700 transition-colors ${expandedItemId === item.id ? "text-blue-400 bg-neutral-700" : "text-gray-500"}`}
                                                            title="Edit item settings"
                                                        >
                                                            <Pencil size={12} />
                                                        </button>

                                                        <span className="text-xs text-gray-600 ml-1">{item.url}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded icon/display settings */}
                                            {expandedItemId === item.id && (
                                                <div className="px-3 pb-3 border-t border-neutral-700 pt-3 space-y-3">
                                                    {/* Display toggles */}
                                                    <div className="flex items-center gap-4">
                                                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.showIcon !== false}
                                                                onChange={(e) => updateItemField(item.id, "showIcon", e.target.checked)}
                                                                className="accent-blue-600 w-3.5 h-3.5"
                                                            />
                                                            <Eye size={12} /> Show Icon
                                                        </label>
                                                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.showText !== false}
                                                                onChange={(e) => updateItemField(item.id, "showText", e.target.checked)}
                                                                className="accent-blue-600 w-3.5 h-3.5"
                                                            />
                                                            <Type size={12} /> Show Text
                                                        </label>
                                                    </div>

                                                    {/* Icon picker */}
                                                    <div>
                                                        <span className="text-xs text-gray-500 mb-2 block">Choose Icon:</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {Object.entries(ICON_OPTIONS).map(([name, Icon]) => (
                                                                <button
                                                                    key={name}
                                                                    onClick={() => updateItemField(item.id, "icon", name)}
                                                                    className={`p-1.5 rounded border transition-all ${item.icon === name
                                                                        ? "border-blue-500 bg-blue-600/20 text-blue-400"
                                                                        : "border-neutral-700 text-gray-500 hover:text-gray-300 hover:border-neutral-500"
                                                                        }`}
                                                                    title={name}
                                                                >
                                                                    <Icon size={14} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Preview */}
                                                    <div className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 flex items-center gap-2">
                                                        <span className="text-xs text-gray-600 mr-2">Preview:</span>
                                                        {item.showIcon !== false && item.icon && (
                                                            <span className="text-blue-400">{renderIconComponent(item.icon, 16)}</span>
                                                        )}
                                                        {item.showText !== false && (
                                                            <span className="text-sm text-gray-200">{item.label}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
