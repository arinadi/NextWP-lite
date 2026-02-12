# NextWP-lite Theme Development Guide

> This documentation serves as the **Primary Instruction** (System Prompt) for AI Agents or Developers tasked with creating new themes for NextWP-lite.

> [!IMPORTANT]
> NextWP-lite uses a **Next.js 16 App Router** architecture with the **"Dual-Realm" strategy**: Admin pages are CSR (Client Components), and Public pages use SSR/ISR (Server Components + `'use cache'`). Themes you create power the **Public Realm** and are rendered as React Server Components by default, with Client Components for interactive elements (dark mode, search, etc.).

---

## 1. Core Principles (The Zen of NextWP-lite Themes)

| Principle | Description |
|---|---|
| **Server Components First** | Templates default to React Server Components (RSC). Only add `"use client"` for interactivity (search, dark mode toggle, etc.). |
| **Minimal Hydration** | Keep client-side JavaScript to a minimum. Content rendering should be static HTML + CSS. Interactive widgets (comments, search) use targeted Client Components. |
| **Tailwind CSS v4** | Use Tailwind v4 utility classes for styling. Theme customization happens through CSS variables — no `tailwind.config.js` needed. |
| **Data via Props** | All data (`Post`, `Settings`, `Menu`) is passed from the server as props via the App Router page. Do **not** fetch data inside theme components. |
| **`'use cache'` Compatible** | Templates must work with Next.js 16's caching model. Avoid side effects in Server Components. |

---

## 2. Theme Directory Structure

Every new theme must be created in its own folder within `src/themes/`.

**Example:** `src/themes/cyberpunk-lite/`

```
src/themes/[theme-name]/
├── assets/             # (Optional) Static images, default theme logo
├── components/         # UI Components (Header, Footer, Sidebar, Navbar)
│   ├── Header.tsx      # Sticky nav with logo, menu, search, dark mode
│   ├── Footer.tsx      # Multi-column footer with links and copyright
│   └── Sidebar.tsx     # Search widget, related posts, categories
├── templates/          # Main Page Templates (Mandatory)
│   ├── Home.tsx        # Homepage (Featured hero + Post grid)
│   ├── Single.tsx      # Single Post View (with sidebar + comments slot)
│   ├── Search.tsx      # Search Results Page
│   ├── Page.tsx        # Static Page View
│   └── NotFound.tsx    # 404 Error Page
├── index.ts            # Entry Point (Theme Manifest)
└── styles.css          # (Optional) Custom CSS if Tailwind is insufficient
```

---

## 3. Data Contracts (TypeScript Interfaces)

Ensure your components are ready to receive props with the following data structure.

### A. Global Data Types

> Reference: `src/types/theme.ts`

```typescript
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
  target?: '_blank' | '_self';
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
```

### B. Props per Template

#### 1. `Home.tsx`

```typescript
interface HomeProps {
  settings: SiteSettings;
  posts: Post[];               // List of latest articles
  onPostClick: (post: Post) => void;  // Navigation handler
  pagination?: {
    currentPage: number;
    totalPages: number;
    nextUrl?: string;
    prevUrl?: string;
  };
}
```

#### 2. `Single.tsx`

```typescript
interface SingleProps {
  settings: SiteSettings;
  post: Post;                  // The article being viewed
  allPosts: Post[];            // For sidebar "Related Posts"
  onBack: () => void;          // Navigation back
  onPostClick: (post: Post) => void;
}
```

#### 3. `Search.tsx`

```typescript
interface SearchProps {
  searchQuery: string;
  allPosts: Post[];            // All posts for filtering/display
  onPostClick: (post: Post) => void;
}
```

#### 4. `Page.tsx`

```typescript
interface PageProps {
  settings: SiteSettings;
  page: Post;                  // Page structure similar to Post
}
```

---

## 4. Entry Point (`index.ts`) — Theme Manifest

Every theme **MUST** have an `index.ts` file that exports the configuration so the system can recognize and load it.

```typescript
// src/themes/theme-name/index.ts

import Home from './templates/Home';
import Single from './templates/Single';
import Search from './templates/Search';
import NotFound from './templates/NotFound';

export default {
  id: 'unique-theme-name',     // Use kebab-case
  name: 'Cool Theme Name',
  version: '1.0.0',
  author: 'Your Name / AI',
  description: 'Short description of the theme...',
  templates: {
    Home,
    Single,
    Search,
    NotFound,
  },
};
```

### Theme Registry (How Themes are Loaded)

The public realm uses a **Theme Registry** pattern with `next/dynamic` to load the active theme:

```typescript
// src/app/(public)/[...slug]/page.tsx
import dynamic from 'next/dynamic';

const themeRegistry = {
  default: dynamic(() => import('@/themes/default/templates/Single')),
  minimal: dynamic(() => import('@/themes/minimal/templates/Single')),
};

// Active theme is determined from the `options` table
const activeTheme = await getOption("active_theme") || "default";
const ThemeComponent = themeRegistry[activeTheme] || themeRegistry.default;
```

---

## 5. Component Implementation Guide (Best Practices)

### Styling with Tailwind CSS v4

Use utility classes directly. With Tailwind v4, theme customization uses CSS variables:

```tsx
// ✅ Correct — Utility-first
<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 hover:text-blue-600 transition-colors">
  {post.title}
</h1>

// ✅ Theme Variables — Override in your theme's styles.css
// --color-primary, --font-heading are Tailwind v4 CSS variables
<h1 className="text-3xl font-bold text-primary dark:text-white">
  {post.title}
</h1>

// ❌ Avoid inline styles
<h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>...</h1>
```

### Dark Mode Support

Use Tailwind's `dark:` variant. The public layout manages the `.dark` class on `<html>`:

```tsx
<div className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">
  {/* Automatically switches based on user preference */}
</div>
```

### Handling HTML Content (Content Body)

Post content is stored as an HTML string (converted from BlockNote JSON). Use `dangerouslySetInnerHTML` and Tailwind Typography's `prose` class:

```tsx
<article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
  <div dangerouslySetInnerHTML={{ __html: post.content }} />
</article>
```

### Comment Integration (Giscus/Disqus)

Provide a container `div` with `id="comments-wrapper"`. The system injects the appropriate comment widget (Giscus or Disqus) based on admin settings:

```tsx
<div id="comments-wrapper" className="mt-10 pt-10 border-t border-gray-200 dark:border-neutral-800">
  {/* System will inject comment widget here */}
</div>
```

### Caching with `'use cache'`

For Server Components, leverage Next.js 16's `'use cache'` directive for optimal caching:

```typescript
// src/lib/posts.ts
'use cache'
import { db } from "@/db";
import { cacheTag } from "next/cache";

export async function getPostBySlug(slug: string) {
  cacheTag(`post-${slug}`);
  return await db.query.posts.findFirst({ where: (p) => eq(p.slug, slug) });
}
```

---

## 6. Template Examples

### Default Theme `Home.tsx` (Reference)

See `src/themes/default/templates/Home.tsx` for the full implementation. Key features:
- Hero section with featured post (full-width, image + text)
- "Latest Articles" 3-column grid with card layout
- Author avatars, dates, categories
- Responsive: stacks on mobile

### Default Theme `Single.tsx` (Reference)

See `src/themes/default/templates/Single.tsx` for the full implementation. Key features:
- Back to Home navigation
- Full-width article header with category, title, author, date
- 21:9 featured image
- Two-column layout: content + sidebar
- Author bio box
- Tags section
- Comments slot (`#comments-wrapper`)

---

## 7. How to Create a New Theme (Step by Step)

1. **Copy** `src/themes/default/` to `src/themes/your-theme-name/`
2. **Update** `index.ts` with your theme's `id`, `name`, `author`, `description`
3. **Customize** the templates and components to match your design
4. **Register** in the theme registry (in the public `[...slug]/page.tsx`)
5. **Activate** by setting `active_theme` to your theme's `id` in the admin Settings
6. **Test** with `vercel dev` to see your theme in action
