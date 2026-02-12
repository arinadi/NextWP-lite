# NextWP-lite Theme Development Guide

> Comprehensive guide for AI agents and developers to build themes that are fully compatible with NextWP-lite.

## Theme Architecture

Each theme is a folder at `src/themes/[theme-name]/` with the following structure:

```
src/themes/[theme-name]/
├── index.ts              # Theme manifest (REQUIRED)
├── components/
│   ├── Header.tsx        # Header component (REQUIRED)
│   ├── Footer.tsx        # Footer component (REQUIRED)
│   └── Sidebar.tsx       # Sidebar widget (optional)
└── templates/
    ├── Home.tsx           # Homepage template (REQUIRED)
    ├── Single.tsx         # Single post template (REQUIRED)
    ├── Search.tsx         # Search results template (REQUIRED)
    └── NotFound.tsx       # 404 page template (REQUIRED)
```

---

## 1. Theme Manifest (`index.ts`)

This is the entry point of the theme. It **must** export a default object with the following shape:

```typescript
import Home from "./templates/Home";
import Single from "./templates/Single";
import Search from "./templates/Search";
import NotFound from "./templates/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

const myTheme = {
    id: "my-theme",           // Unique ID, must match the folder name
    name: "My Theme",         // Display name
    version: "1.0.0",
    author: "Author Name",
    description: "Short description of the theme.",
    templates: {
        Home,
        Single,
        Search,
        NotFound,
    },
    components: {
        Header,
        Footer,
    },
};

export default myTheme;
```

> **IMPORTANT:** All keys in `templates` and `components` are required. Do not skip any.

---

## 2. Data Contracts (Props)

All data types are defined in `src/types/theme.ts`. Themes **MUST** use types from this file.

### Core Types

```typescript
interface Author {
    name: string;
    avatar?: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;          // HTML string rendered from BlockNote
    featuredImage?: string;
    author: Author;
    publishedAt: string;      // ISO String
    category?: string;
    tags?: string[];
}

interface MenuLink {
    label: string;
    url: string;
    target?: "_blank" | "_self";
}

interface SiteSettings {
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

---

## 3. Component Signatures

### Header (REQUIRED)

```typescript
"use client";

interface HeaderProps {
    settings: SiteSettings;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ settings, isDarkMode, toggleTheme }: HeaderProps) {
    // ...
}
```

**Responsibilities:**
- Display logo / site title from `settings.title`
- Render navigation from `settings.menus.primary`
- Dark mode toggle button using `isDarkMode` and `toggleTheme`
- Mobile responsive hamburger menu
- Search form (`action="/search"`, `method="GET"`, input `name="q"`)

### Footer (REQUIRED)

```typescript
// "use client" is not required unless there is interactive state

interface FooterProps {
    settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
    // ...
}
```

**Responsibilities:**
- Render `settings.menus.primary` and `settings.menus.footer`
- Render social links from `settings.socials`
- Copyright text with `settings.title`

### Sidebar (Optional)

```typescript
"use client";

interface SidebarProps {
    posts: Post[];
    title?: string;
    onPostClick: (post: Post) => void;
}

export default function Sidebar({ posts, title, onPostClick }: SidebarProps) {
    // ...
}
```

**Responsibilities:**
- Search widget, related posts list, categories widget
- Used inside `Single` and `Search` templates

---

## 4. Template Signatures

### Home Template (REQUIRED)

```typescript
"use client";

interface HomeTemplateProps {
    posts: Post[];
    settings: SiteSettings;
    onPostClick: (post: Post) => void;
}

export default function HomeTemplate({ posts, settings, onPostClick }: HomeTemplateProps) {
    // NOTE: The client wrapper (HomeClient) already handles empty state,
    // so posts is guaranteed to have at least 1 item here.
    const featuredPost = posts[0];
    const regularPosts = posts.slice(1);
    // ...
}
```

**Requirements:**
- Featured post section (first post)
- Post grid/list (remaining posts)
- Clicking a post **must** call `onPostClick(post)`
- **DO NOT** use `useRouter` directly — navigation is handled via `onPostClick` callback

### Single Template (REQUIRED)

```typescript
"use client";

interface SingleTemplateProps {
    post: Post;
    allPosts: Post[];
    settings: SiteSettings;
    onBack: () => void;
    onPostClick: (post: Post) => void;
}

export default function SingleTemplate({
    post, allPosts, onBack, onPostClick
}: SingleTemplateProps) {
    // ...
}
```

**Requirements:**
- Back button using `onBack()`
- Render `post.content` via `dangerouslySetInnerHTML`
- Featured image display
- Author info box
- Tags display
- Related posts (filtered from `allPosts`)
- Clicking a related post **must** call `onPostClick(post)`

### Search Template (REQUIRED)

```typescript
"use client";

interface SearchTemplateProps {
    searchQuery: string;
    allPosts: Post[];
    onPostClick: (post: Post) => void;
}

export default function SearchTemplate({
    searchQuery, allPosts, onPostClick
}: SearchTemplateProps) {
    // Client-side filtering
    const results = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // ...
}
```

### NotFound Template (REQUIRED)

```typescript
// "use client" is optional — this page is typically stateless
import Link from "next/link";

export default function NotFound() {
    // Static 404 page
    // Use <Link href="/"> for navigation, not onClick handlers
}
```

---

## 5. Critical Rules

### `"use client"` Directive

| File | `"use client"` | Reason |
|---|---|---|
| `index.ts` | ❌ Not needed | Pure re-exports |
| `Header.tsx` | ✅ REQUIRED | Has state (menu toggle, search input) |
| `Footer.tsx` | ❌ Optional | Typically stateless |
| `Sidebar.tsx` | ✅ REQUIRED | Has state (search input) |
| `Home.tsx` | ✅ REQUIRED | Receives `onPostClick` callback |
| `Single.tsx` | ✅ REQUIRED | Receives `onBack`/`onPostClick` callbacks |
| `Search.tsx` | ✅ REQUIRED | Receives `onPostClick` callback |
| `NotFound.tsx` | ❌ Optional | Stateless, uses `<Link>` |

### Import Rules

```typescript
// ✅ CORRECT — import types from @/types/theme
import type { Post, SiteSettings } from "@/types/theme";

// ✅ CORRECT — import internal components via relative path
import Sidebar from "../components/Sidebar";

// ✅ CORRECT — import icons from lucide-react
import { Search, Menu, X, Moon, Sun } from "lucide-react";

// ✅ CORRECT — use Next.js Link for stateless navigation
import Link from "next/link";

// ❌ WRONG — never import from another theme
import Header from "@/themes/default/components/Header";

// ❌ WRONG — do not use useRouter inside templates
// Navigation is handled via callback props (onPostClick, onBack)
import { useRouter } from "next/navigation";
```

### Styling

- Use **Tailwind CSS v4** utility classes
- **MUST** support dark mode via `dark:` prefix
- Smooth transitions: `transition-colors duration-300`
- Responsive: mobile-first with `md:`, `lg:` breakpoints
- Container pattern: `container mx-auto px-4`

### Server-Client Boundary

```
┌─────────────────────────────────┐
│  Server Component (SSR)         │
│  src/app/(public)/page.tsx      │
│  → fetches data from DB         │
│  → passes data as props ↓       │
└─────────────┬───────────────────┘
              │ serializable data only
              │ (Post[], SiteSettings)
              ▼
┌─────────────────────────────────┐
│  Client Wrapper                 │
│  src/components/HomeClient.tsx  │
│  → imports template directly    │
│  → provides onClick handlers    │
│  → renders template             │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Theme Template ("use client")  │
│  themes/[name]/templates/Home   │
│  → renders UI                   │
│  → calls onPostClick callback   │
└─────────────────────────────────┘
```

> **CRITICAL:** Templates must NEVER fetch data themselves. Data is always received via props from Server Component → Client Wrapper → Template.

---

## 6. Registering a New Theme

After creating the theme, register it in `src/lib/themes.ts`:

```typescript
import defaultTheme from "@/themes/default";
import myTheme from "@/themes/my-theme";       // ← add import

const themes = {
    default: defaultTheme,
    "my-theme": myTheme,                        // ← add entry
} as const;
```

Then update the **Client Wrappers** in `src/components/` to import templates from the new theme:

```typescript
// src/components/HomeClient.tsx
// Change the import to the active theme's template
import HomeTemplate from "@/themes/my-theme/templates/Home";
```

> **Note:** Currently the client wrappers (`HomeClient`, `SingleClient`) are hardcoded to `@/themes/default`. To support dynamic theme switching at runtime, a refactor of the client wrappers is needed to conditionally import based on the active theme.

---

## 7. Reference: Default Theme

Use `src/themes/default/` as a complete reference implementation:

| File | Lines | Description |
|---|---|---|
| `index.ts` | 28 | Theme manifest |
| `components/Header.tsx` | 120 | Header with search, dark mode, mobile menu |
| `components/Footer.tsx` | 95 | Footer with menus, socials, copyright |
| `components/Sidebar.tsx` | 88 | Search widget, related posts, categories |
| `templates/Home.tsx` | 131 | Hero featured post + post grid |
| `templates/Single.tsx` | 135 | Article view + sidebar + author box |
| `templates/Search.tsx` | 102 | Search results + sidebar |
| `templates/NotFound.tsx` | 28 | Simple 404 page |

---

## 8. Checklist: Creating a New Theme

```
[ ] Create folder src/themes/[theme-name]/
[ ] Create components/Header.tsx — matching HeaderProps signature
[ ] Create components/Footer.tsx — matching FooterProps signature
[ ] (Optional) Create components/Sidebar.tsx
[ ] Create templates/Home.tsx — matching HomeTemplateProps signature
[ ] Create templates/Single.tsx — matching SingleTemplateProps signature
[ ] Create templates/Search.tsx — matching SearchTemplateProps signature
[ ] Create templates/NotFound.tsx — static 404 page
[ ] Create index.ts — manifest with all imports
[ ] Register theme in src/lib/themes.ts
[ ] Update client wrappers if needed
[ ] Test: npm run build — must exit 0
[ ] Test: visit / and /[slug] — renders with the new theme
```
