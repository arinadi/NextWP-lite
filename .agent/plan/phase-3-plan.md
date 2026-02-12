# Phase 3 Implementation Plan: The Public Renderer

**Goal:** Build the public-facing frontend of NextWP-lite, focusing on performance (ISR/Cache), theming capability, and interactivity (Comments).

## User Review Required
> [!IMPORTANT]
> This phase involves significant changes to the public route structure `src/app/(public)`. Existing public routes might be refactored to support the Theme Registry.

## Proposed Changes

### 1. Theme Registry & Dynamic Loader
- **Logic:** Implement a system to load different themes based on configuration.
- **Files:**
    - `src/lib/themes.ts`: Utilities to fetch active theme and resolve components.
    - `src/app/(public)/layout.tsx`: Update to support theme-based wrappers if needed.
    - `src/app/(public)/page.tsx`: Homepage renderer using Theme Registry.
    - `src/app/(public)/[...slug]/page.tsx`: Dynamic route handler for sets/pages using Theme Registry.

### 2. Default Theme Implementation
- **Goal:** Create a "Default" theme that serves as the baseline and example.
- **Files:**
    - `src/themes/default/index.ts`: Theme manifest/config.
    - `src/themes/default/templates/home.tsx`: Homepage template.
    - `src/themes/default/templates/single.tsx`: Single post/page template.
    - `src/themes/default/templates/not-found.tsx`: 404 template.
    - `src/themes/default/components/*`: Header, Footer, PostCard, etc.

### 3. Caching Strategy (`use cache`)
- **Goal:** Implement Next.js 16 `use cache` directive for optimal performance.
- **Files:**
    - `src/lib/posts.ts`: Update data fetching functions to use `cacheTag` and `'use cache'`.
    - `src/app/(public)/**`: Ensure public pages utilize these cached data functions.

### 4. Giscus Comment Integration
- **Goal:** Add a client-side comment system.
- **Files:**
    - `src/components/Comments.tsx`: Client component for Giscus.
    - `src/db/schema.ts`: Add `giscus_repo_id` and `giscus_category_id` to `options` table (if not already present).
    - `src/themes/default/templates/single.tsx`: Integrate `<Comments />`.

## Verification Plan

### Automated Tests
- **Unit Tests:**
    - Verify `src/lib/themes.ts` correctly resolves default theme when no setting is found.
    - Verify `src/lib/posts.ts` caching tags are set correctly.

### Manual Verification
1.  **Theme Switching:**
    -   Change `active_theme` in database (or via simulated config).
    -   Verify the public site reflects the change (if multiple themes exist, otherwise verification is simply that the default theme loads).
2.  **Public Rendering:**
    -   Visit `/` (Home) -> Should load Default Theme Home.
    -   Visit `/hello-world` (Post) -> Should load Default Theme Single Post.
3.  **Caching:**
    -   Load a page.
    -   Update content in Admin.
    -   Verify `revalidateTag` clears cache and updates content on refresh.
4.  **Comments:**
    -   Navigate to a post.
    -   Verify Giscus widget loads.
