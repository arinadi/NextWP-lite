# NextWP-lite: Master Plan (Ultimate Edition 2026)

## 1. Executive Summary

In the evolving landscape of web architecture as of early 2026, the content management sector faces a persistent dichotomy: the user-friendly but architecturally aging monolithic systems (exemplified by WordPress) versus the high-performance but developer-centric headless architectures. NextWP-lite creates a convergence point between these two paradigms. It is a strategic architectural blueprint designed to deliver the "batteries-included" authoring experience of a monolith while leveraging the serverless, edge-first capabilities of the modern React ecosystem.

This document serves as the exhaustive "Source of Truth" for the construction of NextWP-lite. It integrates updated technical requirements reflecting the stable release of Next.js 16, the maturation of Drizzle ORM v1.0, and the adoption of Better Auth as a superior alternative for role-based access control (RBAC). The core philosophy—"Admin is an App (CSR), Public is a Document (ISR/SSR)"—remains the guiding principle, ensuring that the system allows for rich, stateful management interfaces without compromising the static-first performance required for public content.

The following report details the comprehensive technical strategy, database schema, authentication flows, and frontend architecture required to build NextWP-lite. It addresses the "Dual-Realm" rendering strategy, the "Hybrid Media" logic for cost-effective asset management, and the "First-User" authentication pattern for seamless self-hosting.

## 2. Architectural Vision: The "Dual-Realm" Strategy

The fundamental architectural innovation of NextWP-lite is the strict separation of concerns between the Management Realm (the Admin Dashboard) and the Presentation Realm (the Public Site). This is not merely a routing distinction but a fundamental divergence in rendering strategies, state management, caching policies, and security models.

### 2.1 The Management Realm (Admin)
URL Pattern: `/admin/*`
Rendering Strategy: Client-Side Rendering (CSR) via Next.js Client Components.
Philosophy: "Admin is an App."
Behavior: The dashboard functions effectively as a Single Page Application (SPA). It relies heavily on React Client Components to manage complex, ephemeral state (e.g., the block editor canvas, media library modals, settings toggles). Latency is managed via optimistic UI updates and client-side caching (using TanStack Query v5) rather than server-side HTML caching.
Security: This realm is protected by a strict network boundary. In Next.js 16, this is enforced via proxy.ts (formerly middleware.ts), which intercepts requests to verify session tokens before any asset or data is served.
Data Interaction: Interactions are primarily mutations. The user is constantly writing to the database. Therefore, caching is disabled or kept to strict "stale-while-revalidate" windows to ensure data consistency.

### 2.2 The Presentation Realm (Public)
URL Pattern: `/*` (e.g., `/`, `/blog/my-post`, `/about`)
Rendering Strategy: Incremental Static Regeneration (ISR) augmented by Next.js 16 Cache Components.
Philosophy: "Public is a Document."
Behavior: The public-facing site treats content as static documents. The primary metric is "Time to First Byte" (TTFB). The goal is to serve pre-computed HTML from the Edge.
Innovation: Utilizing Next.js 16's 'use cache' directive allows for granular caching of dynamic components. For instance, a "Recent Posts" widget on a sidebar can be cached independently of the main article content, updating only when a new post is published, without requiring a full site rebuild.
Data Interaction: Interactions are primarily reads. The system assumes a high read-to-write ratio (1000:1).

### 2.3 The Architectural Boundary
The boundary between these two realms is enforced at the network level via the Next.js App Router layout system and the `proxy.ts` layer.

| Feature | Admin Realm (`/app/(admin)`) | Public Realm (`/app/(public)`) |
| :--- | :--- | :--- |
| **Rendering Context** | Client Components (Interactive) | Server Components (Static/Streaming) |
| **Data Fetching** | Client-side fetch / TanStack Query | Server-side `await db.query` |
| **Caching Policy** | `no-store` (Always fresh) | `'use cache'` (Aggressive caching) |
| **Authentication** | Mandatory (Redirect to `/login` if null) | Optional (Public read access) |
| **State Management** | React Context / Zustand / URL Params | URL Parameters / Server Context |
| **Dependency Cost** | Heavy (Editor libs, UI components) | Light (HTML/CSS, minimal hydration) |

This separation ensures that the heavy JavaScript libraries required for the BlockNote editor and media management never pollute the bundle size of the public-facing website, guaranteeing a Lighthouse score of 100/100.

## 3. Technology Stack Updates (2026 Edition)

The original plan specified Next.js 15 and Auth.js v5. Based on the 2026 research landscape, specific upgrades are recommended to ensure longevity, security, and best-in-class performance.

### 3.1 Core Framework: Next.js 16
Next.js 16 is the stable release as of late 2025/early 2026. It introduces critical features that supersede the capabilities of version 15, specifically regarding caching and middleware.
*   **`use cache` Directive:** Next.js 16 introduces a stable "Cache Components" model. This replaces the often confusing time-based revalidation of previous ISR implementations. We can now mark the public page renderer with `'use cache'` to automatically handle static generation and invalidation via tags. This provides "Read-Your-Writes" consistency—when an admin saves a post, we trigger `revalidateTag`, and the cache updates instantly.
*   **`proxy.ts`:** The middleware file convention has been renamed to `proxy.ts`. This clarifies its role as a network proxy for request interception. In NextWP-lite, `proxy.ts` is the gatekeeper for the `/admin` route, verifying authentication cookies before the React app even boots.
*   **Turbopack (Stable):** Turbopack is now the default bundler, offering 10x faster HMR (Hot Module Replacement). This is crucial for the "Theme Development" experience, allowing developers to see CSS changes instantly without full page reloads.

### 3.2 Database: Neon (Serverless PostgreSQL)
Neon remains the optimal choice due to its architecture separating storage from compute. It aligns perfectly with the serverless nature of NextWP-lite.
*   **Branching:** This is a critical feature for the "Safe Update" workflow. When a user updates a theme or core setting, NextWP-lite can internally spin up a database branch to test migrations before applying them to the main branch. This brings DevOps-grade safety to a consumer CMS.
*   **Scale-to-Zero:** Neon's ability to scale compute to zero when unused fits the "Lite" ethos, ensuring that personal blogs or low-traffic documentation sites incur minimal costs.

### 3.3 ORM: Drizzle v1.0
Drizzle has matured to v1.0, introducing Relational Queries v2. This offers a significant developer experience (DX) improvement over the previous syntax.
*   **Relational Syntax:** The new `defineRelations` and query syntax (e.g., `r.one`, `r.many`) make complex joins readable and type-safe. This is essential for fetching "Posts with Authors and Comments" in a single, efficient query.
*   **Performance:** Drizzle's "zero-dependency" philosophy and lightweight wrapper around SQL ensure that server-side data fetching adds negligible overhead to the TTFB.

### 3.4 Authentication: Transition to Better Auth
**Recommendation:** Switch from Auth.js v5 to Better Auth.

While Auth.js (formerly NextAuth) is the incumbent, Better Auth has gained dominance in 2025-2026 for TypeScript-heavy projects.
*   **Admin Plugin:** Better Auth ships with a dedicated Admin Plugin. This drastically simplifies the "Role-Based Access Control" (RBAC) requirement. It allows us to manage users, sessions, and roles (Super Admin vs. Editor) without writing custom boilerplate or complex adapters.
*   **Hooks:** The hooks API in Better Auth is superior for implementing the "First User Admin" pattern. We can intercept the `after.signUp` event to check user counts and promote the initial user, a cleaner implementation than Auth.js callbacks.
*   **Type Safety:** Better Auth offers superior TypeScript inference compared to NextAuth adapters, reducing runtime errors related to session shapes.

### 3.5 Styling: Tailwind CSS v4
Tailwind v4 represents a shift to a "CSS-first" configuration.
*   **Simplification:** It removes the need for `tailwind.config.js` in most cases, favoring native CSS variables.
*   **Theming:** This aligns perfectly with NextWP-lite's theme system. A theme can simply load a CSS file that overrides standard variables (e.g., `--color-primary`, `--font-heading`), and the Tailwind engine will automatically apply these changes without a rebuild.

## 4. Comprehensive Database Schema

The database schema is the backbone of the CMS. Utilizing Drizzle ORM v1.0, we define a schema that supports strict typing, relational integrity, and the flexible nature of a CMS. The schema logic has been updated to use the Drizzle `defineRelations` API.

### 4.1 Schema Definitions (`src/db/schema.ts`)

```typescript
import { pgTable, text, varchar, timestamp, boolean, uuid, jsonb, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

// --------------------------------------------------------------------------
// 1. Users & Authentication (Better Auth Compatible)
// --------------------------------------------------------------------------
// Better Auth uses text IDs by default for broad compatibility
export const users = pgTable("user", {
  id: text("id").primaryKey(), 
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // Better Auth Admin plugin adds 'role' and 'banned' fields
  role: text("role").$type<"super_admin" | "editor" | "author" | "user">().default("user"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
});

// --------------------------------------------------------------------------
// 2. Content Management (Posts & Pages)
// --------------------------------------------------------------------------
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  // Content stored as JSONB to preserve BlockNote structure (blocks, props)
  content: jsonb("content").notNull(), 
  excerpt: text("excerpt"),
  status: text("status").$type<"published" | "draft" | "private">().default("draft"),
  featuredImage: varchar("featured_image"), // URL reference
  allowComments: boolean("allow_comments").default(true),
  authorId: text("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
}, (t) => [
  // Indexes for high-performance lookups
  uniqueIndex("slug_idx").on(t.slug),
  uniqueIndex("status_idx").on(t.status)
]);

// --------------------------------------------------------------------------
// 3. Media Management (Hybrid)
// --------------------------------------------------------------------------
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull(),
  // 'local' = Vercel Blob, 'external' = Hotlinked (Unsplash, etc.)
  source: text("source").$type<"local" | "external">().default("local"),
  type: varchar("type").notNull(), // MIME type: 'image/png', 'video/mp4'
  altText: varchar("alt_text"),
  width: integer("width"),
  height: integer("height"),
  size: integer("size"), // Size in bytes
  uploadedBy: text("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// --------------------------------------------------------------------------
// 4. Site Options (Key-Value Store for Config)
// --------------------------------------------------------------------------
export const options = pgTable("options", {
  key: varchar("key").primaryKey(), // e.g., 'site_title', 'active_theme'
  query: jsonb("value"), // JSONB allows flexible config structures (arrays, objects)
  isPublic: boolean("is_public").default(false), // Should this be exposed to the frontend?
});

// --------------------------------------------------------------------------
// 5. Relations (Drizzle Relations v2 Syntax)
// --------------------------------------------------------------------------
export const relations = defineRelations({ users, posts, media }, (helpers) => ({
  users: {
    posts: helpers.many(posts),
    media: helpers.many(media),
  },
  posts: {
    author: helpers.one(users, {
      fields: [posts.authorId],
      references: [users.id],
    }),
    featuredMedia: helpers.one(media, {
      fields: [posts.featuredImage],
      references: [media.url], // Linking via URL for simpler lookup
    }),
  },
}));
```

### 4.2 Schema Analysis & Justification

**UUID vs Text IDs:** We utilize `uuid` for content (Posts, Media) to ensure collision resistance in distributed environments and to decouple content IDs from sequential ordering. However, we use `text` for users and sessions to align with Better Auth's default schema expectations, minimizing friction during the auth setup.

**JSONB Content:** The `content` field stores the raw JSON output from the BlockNote editor. Storing structured JSON rather than rendered HTML is crucial. It allows the system to change how blocks are rendered (e.g., updating the HTML structure of an "Image Block") without migrating the database content. It also enables the API to serve content to other frontends (e.g., a mobile app) natively.

**Hybrid Media:** The `media` table explicitly distinguishes between `local` and `external` sources. This is a foundational element of the "Hybrid Media Logic." It enables the system to manage both uploaded files (in Vercel Blob) and hotlinked assets (from Unsplash or existing CDNs) within a unified library interface.

## 5. Authentication Strategy: The "First-User" Pattern

A critical requirement for self-hosted CMSs is the initialization process. NextWP-lite implements a "First-User" pattern where the first account created is automatically elevated to Super Admin, while subsequent sign-ups are restricted or assigned a basic User role.

### 5.1 Auth Configuration (`src/lib/auth.ts`)
Using Better Auth, we implement a robust but low-friction authentication system.

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Drizzle instance
import { admin } from "better-auth/plugins";
import { users } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
  hooks: {
    after: {
      signUp: async ({ user, session, context }) => {
        // 1. Check if this is the ONLY user in the database
        // We check if the count is 1 (the user just created)
        const userCount = await db.$count(users);
        
        if (userCount === 1) {
          // 2. Promote to Super Admin
          await db.update(users)
           .set({ role: "super_admin" })
           .where({ id: user.id });
            
          console.log(`🚀 System Init: ${user.email} promoted to Super Admin.`);
        }
      },
    },
  },
});
```

### 5.2 Access Control Logic (RBAC)
The Admin Plugin from Better Auth provides built-in middleware for route protection.
*   **Super Admin:** Has access to all routes (`/admin/*`). Can manage settings (`/admin/settings`), themes, and other users.
*   **Editor:** Can manage all posts and media (`/admin/posts`, `/admin/media`). Cannot access settings or user management.
*   **Author:** Can only manage their own posts.
*   **Invite-Only System:** To enforce the "Invite Only" requirement for subsequent users, we can utilize the Better Auth organization plugin or a simple middleware check. Any sign-up attempt after the first user requires a valid invitation token, or the public `signUp` endpoint is disabled entirely via configuration (`allowSignUp: false`), forcing admins to manually create users via the dashboard.

## 6. Feature Specifications: The "WordPress-like" Experience

### 6.1 The BlockNote Editor Implementation
The editor is the heart of the "Admin is an App" philosophy. We use BlockNote (based on Prosemirror/TipTap) but heavily customized to support the Hybrid Media requirement.

**Custom Media Panel (Hybrid Logic):**
We override the default file handling to present a tabbed interface in the editor:
*   **Upload:** Drag & Drop to Vercel Blob.
*   **Library:** Select from the media database table (a grid of previously used images).
*   **Hotlink:** Paste a URL (e.g., Unsplash).

**Code Implementation Concept (`src/components/editor/HybridMediaBlock.tsx`):**

```typescript
import { useCreateBlockNote } from "@blocknote/react";
import { uploadToVercelBlob } from "@/lib/media"; // Server Action

const editor = useCreateBlockNote({
  // Override the default upload handler
  uploadFile: async (file: File) => {
    // 1. Upload to Vercel Blob via Server Action
    const blobUrl = await uploadToVercelBlob(file);
    
    // 2. Record in DB as 'local' source
    await saveMediaToDb({
      url: blobUrl,
      type: file.type,
      source: "local",
      altText: file.name
    });
    
    return blobUrl;
  },
});
```
For the "Library" tab, we create a custom React component that fetches media from the `/api/media` endpoint and inserts the selected image URL into the block.

### 6.2 The Theme System (Dynamic Rendering)
To mimic WordPress themes without the PHP overhead, we use Next.js Dynamic Imports and a rigorous directory structure. Since React Server Components cannot dynamically import paths that are unknown at build time without some configuration, we implement a Theme Registry.

*   **Theme Location:** `src/themes/[theme_name]/`
*   **Active Theme Config:** Stored in `options` table as `active_theme`.
*   **Renderer Logic:** The Public Realm (`src/app/(public)/[...slug]/page.tsx`) acts as a router that delegates rendering to the active theme.

```typescript
// src/app/(public)/[...slug]/page.tsx
import { getOption } from "@/lib/options";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

// Map of available themes to their entry points
// This ensures Webpack/Turbopack bundles them correctly
const themeRegistry = {
  default: dynamic(() => import('@/themes/default/templates/single')),
  minimal: dynamic(() => import('@/themes/minimal/templates/single')),
};

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch Active Theme
  const activeTheme = await getOption("active_theme") || "default";
  
  // 2. Fetch Content
  const slug = resolvedParams.slug?.join("/") || "home";
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // 3. Select Theme Component
  const ThemeComponent = themeRegistry[activeTheme] || themeRegistry.default;

  // 4. Render
  return <ThemeComponent post={post} />;
}
```

### 6.3 Comment System (Zero-DB)
To maintain the "Lite" architecture and reduce database load, comments are offloaded to third-party services.
*   **Strategy:** Giscus (GitHub Discussions) is the primary supported engine.
*   **Integration:** A global setting (`options` table) holds the Giscus Repo ID and Category ID.
*   **Rendering:** A Client Component `<CommentsSection />` reads these IDs and renders the Giscus iframe. This avoids storing spam or comment data in the primary Neon database, keeping the footprint minimal.

## 7. Public Realm: Performance & SEO (Next.js 16)

### 7.1 Caching Strategy (`use cache`)
Next.js 16 simplifies the complex ISR patterns of the past. We use the `'use cache'` directive to ensure pages are generated statically and only recomputed when data changes.

**Data Fetching Wrapper:**
```typescript
// src/lib/posts.ts
'use cache'
import { db } from "@/db";
import { cacheTag } from "next/cache";

export async function getPostBySlug(slug: string) {
  // This query result will be cached automatically
  // Tagging allows for on-demand invalidation via revalidateTag
  cacheTag(`post-${slug}`); 
  return await db.query.posts.findFirst({ where: (p) => eq(p.slug, slug) });
}
```

### 7.2 On-Demand Invalidation
When an admin updates a post in the dashboard, we trigger a revalidation via Server Actions. This ensures "Read-Your-Writes" consistency.

```typescript
// src/actions/posts.ts
'use server'
import { revalidateTag } from "next/cache";

export async function updatePost(id: string, data: any) {
  await db.update(posts).set(data).where(eq(posts.id, id));
  
  // Invalidate the specific post and the list of recent posts
  revalidateTag(`post-${data.slug}`);
  revalidateTag('recent-posts');
}
```

### 7.3 Progressive Web App (PWA) with Serwist
`next-pwa` is deprecated. In 2026, we use `@serwist/next` for PWA capabilities.
*   **Service Worker:** Caches the "App Shell" (fonts, CSS, logos) and provides offline fallback pages.
*   **Manifest:** Generated dynamically via `src/app/manifest.ts`. This allows admins to change the Site Icon and Name in the CMS settings, and the PWA manifest updates automatically without a code redeploy.

## 8. Infrastructure & Deployment Lifecycle

### 8.1 Vercel Blob vs. Cloudflare R2
*   **Vercel Blob:**
    *   *Pros:* Zero-config integration with Next.js, "local" feeling API.
    *   *Cons:* Higher cost ($0.15/GB egress) compared to R2.
*   **Cloudflare R2:**
    *   *Pros:* Zero egress fees, cheaper storage.
    *   *Cons:* Requires S3 SDK setup and separate billing.
*   **Verdict:** Vercel Blob is the default for the "Lite" configuration due to its seamless DX. However, the schema supports an external source type, allowing power users to configure an S3/R2 client if they prefer lower costs at scale.

### 8.2 Database Branching Workflow (Neon)
Neon's branching capability transforms the development lifecycle.
*   **Dev:** Developers connect to a local branch or a dev branch on Neon.
*   **Preview:** When a Pull Request is opened (e.g., adding a new Theme), Vercel creates a Preview Deployment. A GitHub Action triggers Neon to create a database branch from main for this PR. This allows testing schema changes (migrations) in an isolated environment without risking the live site.
*   **Merge:** On merge, schema changes are applied to main.

## 9. Comprehensive Directory Structure

This structure enforces the boundary between Admin (App) and Public (Document), updated for Next.js 16 conventions.

```plaintext
├── src/
│   ├── app/
│   │   ├── (public)/          # SEO & Presentation Realm (Server Components)
│   │   │   ├── [slug]/        # Dynamic Content Handler
│   │   │   │   └── page.tsx   # 'use cache' enabled renderer
│   │   │   ├── layout.tsx     # Public Root Layout (Themes, Fonts)
│   │   │   └── page.tsx       # Homepage Renderer
│   │   ├── (admin)/           # Management Realm (Client Components)
│   │   │   ├── admin/
│   │   │   │   ├── posts/     # Data Tables & Editor
│   │   │   │   ├── media/     # Hybrid Media Library
│   │   │   │   ├── settings/  # Site Options Form
│   │   │   │   └── layout.tsx # Dashboard Shell (Sidebar, Auth Check)
│   │   ├── api/               # Backend Routes
│   │   │   ├── auth/          # Better Auth Endpoints
│   │   │   ├── upload/        # Vercel Blob Handlers
│   │   │   └── cron/          # Scheduled Tasks
│   │   ├── manifest.ts        # Dynamic PWA Manifest
│   │   └── proxy.ts           # Next.js 16 Middleware (Auth Guard)
│   ├── components/
│   │   ├── admin/             # Dashboard UI (Shadcn)
│   │   │   ├── editor/        # BlockNote Custom Components
│   │   │   └── media/         # Media Picker
│   │   ├── themes/            # Shared Theme Components
│   │   └── ui/                # Shadcn Primitives
│   ├── db/
│   │   ├── schema.ts          # Drizzle Definitions
│   │   └── index.ts           # Neon Connection
│   ├── lib/
│   │   ├── auth.ts            # Better Auth Config
│   │   ├── auth-client.ts     # Client Auth Hooks
│   │   └── blob.ts            # Vercel Blob Helper
│   └── themes/                # Theme Repository
│       ├── default/
│       └── minimal/
├── drizzle.config.ts          # Drizzle Kit Config
├── next.config.ts             # Next.js Config (Typed)
└── package.json
```

## 10. Implementation Roadmap

NextWP-lite represents a convergence of the best practices of 2026. By adopting Next.js 16, we eliminate the complex revalidation logic of the past in favor of a native Caching API. By moving to Better Auth, we simplify the critical role-management piece. Finally, Neon and Drizzle provide a data layer that is both developer-friendly and scalable.

### 10.1 Phase 1: Foundation (Weeks 1-2)
*   Setup Next.js 16 + Tailwind v4.
*   Initialize Neon DB and Drizzle Schema (v2 relations).
*   Implement Better Auth with "First User Admin" hook.
*   Create the basic directory structure separating `(admin)` and `(public)`.

### 10.2 Phase 2: The Engine (Weeks 3-4)
*   Build the Admin Dashboard Layout.
*   Integrate BlockNote editor.
*   Implement the "Hybrid Media" upload handler (Blob + DB recording).
*   Build the Media Library grid view.

### 10.3 Phase 3: The Public Renderer (Weeks 5-6)
*   Implement the Theme Registry and Dynamic Loader.
*   Create the "Default" theme (Clean, typography-focused).
*   Implement the `use cache` strategy for sub-millisecond TTFB.
*   Add Giscus comment integration.

### 10.4 Phase 4: Polish (Week 7)
*   PWA Integration (Serwist).
*   Generate dynamic `manifest.json`.
*   Lighthouse Auditing (Target: 100/100).

This Master Plan provides a complete blueprint for executing NextWP-lite, ensuring it meets the "Ultimate Edition" standard of performance, usability, and maintainability.