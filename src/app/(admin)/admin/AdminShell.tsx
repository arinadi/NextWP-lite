"use client";

import { signOut } from "next-auth/react";
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
    LogOut,
    User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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
                className={cn(
                    "group flex items-center justify-between px-3 py-2 cursor-pointer text-sm font-medium transition-colors",
                    isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
            >
                <div className="flex items-center gap-3">
                    <Icon className="size-4" />
                    <span>{label}</span>
                </div>
                {hasSubmenu && (
                    <ChevronDown className={cn("size-3 transition-transform duration-200", isOpen && "rotate-180")} />
                )}
            </div>
            {hasSubmenu && isOpen && (
                <div className="bg-muted/30 pl-9 py-1 space-y-1">{children}</div>
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
            className={cn(
                "block cursor-pointer text-xs py-1 transition-colors",
                active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {label}
        </Link>
    );
}

// --- Sidebar Navigation Partial ---

function SidebarNav({ pathname, expandedMenus, toggleSubmenu }: any) {
    return (
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
                <SubmenuItem label="Categories" href="/admin/categories" active={pathname === "/admin/categories"} />
            </SidebarItem>

            <SidebarItem
                icon={ImageIcon}
                label="Media"
                href="/admin/media"
                isActive={pathname === "/admin/media"}
            />

            <SidebarItem icon={FileText} label="Pages" href="/admin/pages" isActive={pathname === "/admin/pages"} />

            <div className="my-2 h-px bg-border" />

            <SidebarItem
                icon={PaintBucket}
                label="Appearance"
                isActive={pathname === "/admin/menus"}
                hasSubmenu
                isOpen={expandedMenus["appearance"]}
                onToggle={() => toggleSubmenu("appearance")}
            >
                <SubmenuItem label="Themes" href="/admin/themes" active={pathname === "/admin/themes"} />
                <SubmenuItem label="Menus" href="/admin/menus" active={pathname === "/admin/menus"} />
            </SidebarItem>

            <SidebarItem icon={Users} label="Users" href="/admin/users" isActive={pathname === "/admin/users"} />

            <SidebarItem
                icon={Settings}
                label="Settings"
                href="/admin/settings"
                isActive={pathname === "/admin/settings"}
            />
        </div>
    );
}

// --- Main Shell ---

export default function AdminShell({
    children,
    userName,
    userImage,
}: {
    children: React.ReactNode;
    userName?: string;
    userImage?: string | null;
}) {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

    const toggleSubmenu = (key: string) => {
        setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const initials = userName
        ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AD";

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
            {/* Admin Top Bar */}
            <div className="h-12 bg-background border-b flex items-center justify-between px-4 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="md:hidden">
                                <MenuIcon className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-48 p-0">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle className="text-left">NextWP Admin</SheetTitle>
                            </SheetHeader>
                            <SidebarNav
                                pathname={pathname}
                                expandedMenus={expandedMenus}
                                toggleSubmenu={toggleSubmenu}
                            />
                        </SheetContent>
                    </Sheet>

                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
                    >
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                            W
                        </div>
                        <span className="hidden sm:inline">NextWP</span>
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ExternalLink className="size-3" />
                        <span className="hidden sm:inline">Visit Site</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 gap-2 px-2 hover:bg-accent">
                                <span className="text-xs text-muted-foreground hidden sm:inline">
                                    Howdy, <span className="font-semibold text-foreground uppercase">{userName || "Admin"}</span>
                                </span>
                                {userImage ? (
                                    <img src={userImage} alt="" className="w-6 h-6 rounded-full object-cover border" />
                                ) : (
                                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-[10px] border">
                                        {initials}
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/profile" className="cursor-pointer">
                                    <User className="mr-2 size-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings" className="cursor-pointer">
                                    <Settings className="mr-2 size-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                                <LogOut className="mr-2 size-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex pt-12 min-h-screen">
                {/* Desktop Sidebar Navigation */}
                <div className="hidden md:flex w-40 bg-background flex-shrink-0 sticky top-12 bottom-0 h-[calc(100vh-3rem)] overflow-y-auto z-40 border-r flex-col">
                    <div className="flex-1">
                        <SidebarNav
                            pathname={pathname}
                            expandedMenus={expandedMenus}
                            toggleSubmenu={toggleSubmenu}
                        />
                    </div>

                    <div className="p-2 border-t bg-muted/20">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground group">
                            <ChevronRight className="size-3 mr-2 group-hover:translate-x-0.5 transition-transform" />
                            <span className="text-xs">Collapse</span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-muted/10 p-4 md:p-8 overflow-x-hidden w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
