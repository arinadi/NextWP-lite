// Theme Data Contracts

export interface Author {
    name: string;
    avatar?: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string; // HTML string processed from BlockNote
    featuredImage?: string;
    author: Author;
    publishedAt: string; // ISO String
    category?: string;
    tags?: string[];
}

export interface MenuLink {
    label: string;
    url: string;
    target?: "_blank" | "_self";
}

export interface SiteSettings {
    title: string;
    tagline: string;
    logoUrl?: string;
    menus: {
        primary: MenuLink[];
        footer: MenuLink[];
    };
    socials?: {
        twitter?: string;
        github?: string;
    };
}

export interface HomeProps {
    settings: SiteSettings;
    posts: Post[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        nextUrl?: string;
        prevUrl?: string;
    };
}

export interface SingleProps {
    settings: SiteSettings;
    post: Post;
    relatedPosts?: Post[];
}

export interface SearchProps {
    settings: SiteSettings;
    searchQuery: string;
    posts: Post[];
    allPosts: Post[];
}

export interface PageProps {
    settings: SiteSettings;
    page: Post;
}
