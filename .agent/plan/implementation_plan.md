# NextWP-lite: Implementation Plan

Build a full-stack CMS with Next.js 16, implementing the "Dual-Realm" architecture from the master plan. **Optimized for Vercel Serverless** — all API routes, SSR, and data fetching run as serverless functions on Vercel's edge infrastructure. Admin UI follows CSR (SPA-like), Public UI follows SSR/ISR. The UI must match the provided mockups exactly.

## User Review Required

> [!IMPORTANT]
> This plan creates **the entire project from scratch**. There is no existing code. All files listed below are new.

> [!WARNING]
> **Database & Auth**: This plan includes schema definitions and Better Auth setup, but the actual Neon DB connection requires environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`). These will be added to `.env.local` which should not be committed.

---

## Proposed Changes

### 1. Project Initialization

#### [NEW] Project scaffold via `create-next-app`
- Run `npx -y create-next-app@latest ./` with TypeScript, Tailwind CSS v4, App Router, src/ directory
- Install dependencies: `drizzle-orm`, `better-auth`, `@blocknote/core`, `@blocknote/react`, `lucide-react`, `@tanstack/react-query`

---

### 2. Core Configuration

#### [NEW] [drizzle.config.ts](file:///d:/NextWP-lite/drizzle.config.ts)
- Drizzle Kit config pointing to `src/db/schema.ts` with PostgreSQL dialect

#### [NEW] [.env.local](file:///d:/NextWP-lite/.env.local)
- Placeholder `DATABASE_URL` and `BETTER_AUTH_SECRET`

---

### 3. Database & Auth Layer

#### [NEW] [schema.ts](file:///d:/NextWP-lite/src/db/schema.ts)
- Full schema from master plan: `users`, `sessions`, `accounts`, `posts`, `media`, `options` tables
- Drizzle Relations v2 via `defineRelations`

#### [NEW] [index.ts](file:///d:/NextWP-lite/src/db/index.ts)
- Neon serverless connection + Drizzle instance export

#### [NEW] [auth.ts](file:///d:/NextWP-lite/src/lib/auth.ts)
- Better Auth config with Drizzle adapter, email/password, Admin plugin
- "First-User Admin" hook (promote first signup to `super_admin`)

#### [NEW] [auth-client.ts](file:///d:/NextWP-lite/src/lib/auth-client.ts)
- Client-side auth hooks for session management in admin pages

---

### 4. Admin UI (CSR) — `/app/(admin)/`

All admin pages are Client Components matching the [admin-mockup.jsx](file:///d:/NextWP-lite/.agent/plan/admin-mockup.jsx) exactly.

#### [NEW] [layout.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/layout.tsx)
- Admin shell: top bar with logo/visit site/user profile + collapsible sidebar with navigation
- Mobile responsive: hamburger menu with overlay
- All sidebar items with submenu support (Posts → All Posts/Add New/Categories, Appearance → Themes/Menus, Settings → General/Reading/Discussion)

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/page.tsx)
- Dashboard with "At a Glance" widget (post/page/comment counts) + "Quick Draft" widget (title input, textarea, save button)

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/posts/page.tsx)
- Post list with status filters (All/Published/Drafts/Trash), search bar, data table with checkboxes
- Hover actions: Edit/Quick Edit/Trash/View

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/posts/editor/page.tsx)
- Two-column layout: main editor area (title input + BlockNote toolbar + content area) + sidebar (Publish/Categories/Featured Image panels)

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/media/page.tsx)
- Grid/List toggle, date/type filters, bulk select
- Upload drop zone + image grid with hover overlay showing filename and blue selection border

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/menus/page.tsx)
- Menu selector + "or create new" link
- Two-column: left = add items (Pages checkboxes), right = menu structure area with name input + save

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(admin)/admin/settings/page.tsx)
- General Settings: Site Title + Tagline inputs
- Discussion Settings: comment toggle, provider select (Giscus/Disqus), conditional config fields

---

### 5. Public UI (SSR/ISR) — `/app/(public)/`

Public pages rendered as Server Components matching [public-mockup.jsx](file:///d:/NextWP-lite/.agent/plan/public-mockup.jsx).

#### [NEW] [layout.tsx](file:///d:/NextWP-lite/src/app/(public)/layout.tsx)
- Public layout wrapper with dark mode support

#### [NEW] Shared Components in `src/themes/default/components/`
- **Header**: Sticky with logo, nav, search, dark mode toggle, mobile menu
- **Footer**: Multi-column with site info, links, copyright
- **Sidebar**: Search widget, related/most-read posts, categories

#### [NEW] Templates in `src/themes/default/templates/`
- **Home**: Hero featured post section + "Latest Articles" 3-column grid with cards
- **Single**: Full article view with back button, category badge, author box, tags, discussion slot, sidebar
- **Search**: Results header + list view with sidebar
- **NotFound**: 404 page

#### [NEW] [index.ts](file:///d:/NextWP-lite/src/themes/default/index.ts)
- Theme manifest exporting all templates and metadata

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(public)/page.tsx)
- Homepage using default theme's Home template with mock data

#### [NEW] [page.tsx](file:///d:/NextWP-lite/src/app/(public)/[...slug]/page.tsx)
- Dynamic route handler with theme registry + dynamic import

---

### 6. Theme System Update

#### [MODIFY] [THEME.md](file:///d:/NextWP-lite/.agent/plan/THEME.md)
- Update from old WPVite (Vite SSR + `renderToString`) to Next.js 16 (App Router + `'use cache'` + RSC)
- Replace "Pure SSR / No Hydration" → "React Server Components by default, Client Components for interactivity"
- Add theme registry pattern with `dynamic()` imports
- Update directory structure for Next.js App Router layout
- Add [SearchTemplate](file:///d:/NextWP-lite/.agent/plan/public-mockup.jsx#511-584) to required templates
- Update data contracts with pagination and search props
- Add `'use cache'` + `cacheTag` examples
- Replace comment section from "script injection" → Giscus Client Component

---

### 7. Shared UI Components

#### [NEW] Components in `src/components/ui/`
- Reusable primitives: [Button](file:///d:/NextWP-lite/.agent/plan/admin-mockup.jsx#89-103), [Input](file:///d:/NextWP-lite/.agent/plan/admin-mockup.jsx#104-114), [Select](file:///d:/NextWP-lite/.agent/plan/admin-mockup.jsx#115-127) — matching admin mockup styling
- Used across admin pages

---

## Verification Plan

### Automated Tests
Since this is a greenfield project, we verify via Vercel dev server (required for serverless functions):

```bash
# 1. Install dependencies
npm install

# 2. Run dev server with Vercel serverless runtime
vercel dev

# 3. Build check (no type errors)
npm run build
```

> [!NOTE]
> `vercel dev` is required instead of `npm run dev` to properly simulate the Vercel serverless function environment locally (API routes, edge functions, etc.).

### Manual Verification
1. **Admin UI**: Open `http://localhost:3000/admin` in browser
   - Verify sidebar navigation works (click each item, check page renders)
   - Verify mobile responsive: resize browser < 768px, check hamburger menu
   - Check all 6 pages render correctly: Dashboard, Posts, Editor, Media, Menus, Settings

2. **Public UI**: Open `http://localhost:3000/` in browser
   - Verify homepage shows featured post hero + article grid
   - Click a post → verify single post page renders
   - Test search functionality
   - Toggle dark mode button
   - Check mobile responsive layout

3. **Theme System**: Verify theme registry loads default theme correctly. The public pages should render using the default theme's templates.
