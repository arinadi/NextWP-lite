"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    PaintBucket,
    Users,
    Settings,
    ExternalLink,
    Menu as MenuIcon,
    ChevronDown,
    ChevronRight,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- Sidebar Components ---

function SidebarItem({
    icon: Icon,
    label,
    href,
    isActive,
    hasSubmenu,
    isOpen,
    onToggle,
    children,
}: {
    icon: React.ElementType;
    label: string;
    href?: string;
    isActive?: boolean;
    hasSubmenu?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
    children?: React.ReactNode;
}) {
    const content = (
        <>
            <div
                onClick={hasSubmenu ? onToggle : undefined}
                className={`
          group flex items-center justify-between px-3 py-2 cursor-pointer text-sm font-medium transition-colors
          ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-neutral-800 hover:text-blue-400"}
        `}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{label}</span>
                </div>
                {hasSubmenu && (
                    <div className={`text-[10px] text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown size={14} />
                    </div>
                )}
            </div>
            {hasSubmenu && isOpen && (
                <div className="bg-neutral-950 pl-10 py-1 space-y-1">{children}</div>
            )}
        </>
    );

    if (href && !hasSubmenu) {
        return <Link href={href}>{content}</Link>;
    }
    return <div>{content}</div>;
}

function SubmenuItem({
    label,
    href,
    active,
}: {
    label: string;
    href: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className={`
        block cursor-pointer text-xs py-1 transition-colors
        ${active ? "text-white font-medium" : "text-gray-500 hover:text-blue-400"}
      `}
        >
            {label}
        </Link>
    );
}

// --- Main Layout ---

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

    const toggleSubmenu = (key: string) => {
        setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col font-sans text-gray-300">
            {/* Admin Top Bar */}
            <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <div
                        className="md:hidden cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
                    </div>
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-gray-100 font-semibold cursor-pointer hover:text-blue-400 transition-colors"
                    >
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            W
                        </div>
                        <span className="hidden sm:inline">NextWP</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                    >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Visit Site</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-300">
                        Howdy, <span className="font-semibold">Admin</span>
                    </span>
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-xs">
                        AD
                    </div>
                </div>
            </div>

            <div className="flex pt-12 min-h-screen">
                {/* Sidebar Navigation */}
                <div
                    className={`
            w-40 bg-neutral-950 flex-shrink-0 fixed md:sticky top-12 bottom-0 left-0 h-[calc(100vh-3rem)] overflow-y-auto z-40
            transition-transform duration-300 border-r border-neutral-800
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
                >
                    <div className="py-2">
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            href="/admin"
                            isActive={pathname === "/admin"}
                        />
                        <SidebarItem
                            icon={FileText}
                            label="Posts"
                            isActive={pathname.startsWith("/admin/posts")}
                            hasSubmenu
                            isOpen={expandedMenus["posts"]}
                            onToggle={() => toggleSubmenu("posts")}
                        >
                            <SubmenuItem label="All Posts" href="/admin/posts" active={pathname === "/admin/posts"} />
                            <SubmenuItem label="Add New" href="/admin/posts/editor" active={pathname === "/admin/posts/editor"} />
                            <SubmenuItem label="Categories" href="/admin/posts" />
                        </SidebarItem>

                        <SidebarItem
                            icon={ImageIcon}
                            label="Media"
                            href="/admin/media"
                            isActive={pathname === "/admin/media"}
                        />

                        <SidebarItem icon={FileText} label="Pages" href="/admin" />

                        <div className="my-2 h-px bg-neutral-800" />

                        <SidebarItem
                            icon={PaintBucket}
                            label="Appearance"
                            isActive={pathname === "/admin/menus"}
                            hasSubmenu
                            isOpen={expandedMenus["appearance"]}
                            onToggle={() => toggleSubmenu("appearance")}
                        >
                            <SubmenuItem label="Themes" href="/admin" />
                            <SubmenuItem label="Menus" href="/admin/menus" active={pathname === "/admin/menus"} />
                        </SidebarItem>

                        <SidebarItem icon={Users} label="Users" href="/admin" />

                        <SidebarItem
                            icon={Settings}
                            label="Settings"
                            isActive={pathname === "/admin/settings"}
                            hasSubmenu
                            isOpen={expandedMenus["settings"]}
                            onToggle={() => toggleSubmenu("settings")}
                        >
                            <SubmenuItem label="General" href="/admin/settings" active={pathname === "/admin/settings"} />
                            <SubmenuItem label="Reading" href="/admin/settings" />
                            <SubmenuItem label="Discussion" href="/admin/settings" />
                        </SidebarItem>
                    </div>

                    <div className="absolute bottom-0 w-full p-2 border-t border-neutral-800 bg-neutral-950 text-center">
                        <button className="text-gray-500 hover:text-blue-400 text-xs flex items-center justify-center gap-1 w-full">
                            <div className="border border-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
                                <ChevronRight size={10} />
                            </div>
                            <span>Collapse</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-neutral-900 p-4 md:p-8 overflow-x-hidden w-full">
                    {children}
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
