# NextWP-lite Theme Mockup Guide

> Design reference for designers and AI agents creating static theme mockups.
> After the mockup is finalized, a developer converts it into a working theme using [`theme.md`](./theme.md).

## Workflow

```
Designer reads mockup.md
        ↓
Creates static HTML/CSS mockup (or image)
        ↓
Developer reads the mockup + theme.md
        ↓
Converts mockup into a NextWP-lite theme
```

---

## 1. Pages to Design

Every theme **must** include mockups for these 6 views:

| # | View | Description |
|---|---|---|
| 1 | **Header** | Persistent top navigation bar |
| 2 | **Footer** | Persistent site footer |
| 3 | **Home** | Homepage with featured post + post listing |
| 4 | **Single** | Full article view |
| 5 | **Search** | Search results page |
| 6 | **404** | Page not found |

---

## 2. Available Data

These are the **only** data fields accessible in a theme. Design around them — do not invent fields that don't exist.

### Post

| Field | Type | Notes |
|---|---|---|
| `title` | string | Always present |
| `slug` | string | URL path segment |
| `excerpt` | string | Short summary, may be empty |
| `content` | HTML string | Full article body rendered from the editor |
| `featuredImage` | string? | URL to image, **may be missing** |
| `author.name` | string | Always present |
| `author.avatar` | string? | URL to avatar, may be missing |
| `publishedAt` | ISO date | e.g. "November 28, 2025" |
| `category` | string? | Single category, may be missing |
| `tags` | string[]? | Array of tag strings, may be missing |

### Site Settings

| Field | Type | Notes |
|---|---|---|
| `title` | string | Site name, used in header + footer |
| `tagline` | string | Used in hero area or meta |
| `logoUrl` | string? | Logo image URL, may be missing (fallback to text) |
| `menus.primary` | MenuLink[] | Top navigation links |
| `menus.footer` | MenuLink[] | Footer links (e.g. Privacy, Terms) |
| `socials.twitter` | string? | Twitter/X profile URL |
| `socials.github` | string? | GitHub profile URL |

### MenuLink

| Field | Type |
|---|---|
| `label` | string |
| `url` | string |
| `target` | `"_blank"` or `"_self"` (optional) |

---

## 3. Layout Blueprints

Use the ASCII diagrams below as structural references. You have full creative freedom for visual style, but the **sections and data slots must exist**.

### 3.1 Header

```
┌──────────────────────────────────────────────────────┐
│  [Logo / Site Title]    [Nav Links...]   [🔍] [🌙]  │
└──────────────────────────────────────────────────────┘
```

**Required elements:**
- Site title or logo (`settings.title` / `settings.logoUrl`)
- Primary navigation menu (`settings.menus.primary`)
- Search trigger (opens search or navigates to `/search`)
- Dark mode toggle button
- Mobile: hamburger menu that reveals nav items

### 3.2 Footer

```
┌──────────────────────────────────────────────────────┐
│  [Site Title]     [Nav Links]   [Footer Links]  [Social] │
│  [Tagline]        Home          Privacy          𝕏  GH   │
│                   Features      Terms                     │
│                   Blog          Contact                   │
│─────────────────────────────────────────────────────────│
│  © 2026 Site Title                    Designed with ♥   │
└──────────────────────────────────────────────────────┘
```

**Required elements:**
- Site title + description
- Primary menu links
- Footer menu links
- Social icons (Twitter/X, GitHub)
- Copyright line with current year

### 3.3 Home Page

```
┌──────────────────────────────────────────────────────┐
│                    [HEADER]                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────┬─────────────────────────┐  │
│  │   • Featured Post   │                         │  │
│  │   TITLE (large)     │    [Featured Image]     │  │
│  │   Excerpt text...   │    aspect 4:3           │  │
│  │   👤 Author • Date  │                         │  │
│  └─────────────────────┴─────────────────────────┘  │
│                                                      │
│  Latest Articles                       View Archive → │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│  │  [Image]   │ │  [Image]   │ │  [Image]   │      │
│  │  CATEGORY  │ │  CATEGORY  │ │  CATEGORY  │      │
│  │  Title     │ │  Title     │ │  Title     │      │
│  │  Excerpt   │ │  Excerpt   │ │  Excerpt   │      │
│  │  👤 • 📅   │ │  👤 • 📅   │ │  👤 • 📅   │      │
│  └────────────┘ └────────────┘ └────────────┘      │
│                                                      │
├──────────────────────────────────────────────────────┤
│                    [FOOTER]                          │
└──────────────────────────────────────────────────────┘
```

**Layout rules:**
- **Featured section**: First post, displayed prominently. 2-column layout (text left, image right) on desktop; stacked on mobile.
- **Post grid**: Remaining posts in a 3-column grid (desktop), 2-column (tablet), 1-column (mobile).
- **Post card slots**: Image (aspect 16:9), category label, title, excerpt (3-line clamp), author + date.
- All post cards and the featured post are **clickable** (entire card).

### 3.4 Single Post Page

```
┌──────────────────────────────────────────────────────┐
│                    [HEADER]                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ← Back to Home                                     │
│                                                      │
│  CATEGORY                                            │
│  Article Title (very large, bold)                    │
│  👤 Author Name  •  November 28, 2025               │
│                                                      │
│  ┌──────────────────────────────────┬──────────┐    │
│  │                                  │          │    │
│  │  [Featured Image, aspect 21:9]   │ SIDEBAR  │    │
│  │                                  │          │    │
│  │  Article content body...         │ [Search] │    │
│  │  <p>, <h3>, <blockquote>,        │          │    │
│  │  <ul>, <img>, etc.               │ Related  │    │
│  │                                  │ Posts    │    │
│  │  ────────────────────────        │          │    │
│  │  #Tag1  #Tag2  #Tag3             │ Categor- │    │
│  │                                  │ ies      │    │
│  │  ┌──────────────────────┐        │          │    │
│  │  │ AUTHOR BOX           │        │          │    │
│  │  │ [Avatar] Name        │        │          │    │
│  │  │ Short bio text       │        │          │    │
│  │  └──────────────────────┘        │          │    │
│  │                                  │          │    │
│  │  ────────────────────────        │          │    │
│  │  Discussion                      │          │    │
│  │  [Giscus comment widget]         │          │    │
│  │                                  │          │    │
│  └──────────────────────────────────┴──────────┘    │
│                                                      │
├──────────────────────────────────────────────────────┤
│                    [FOOTER]                          │
└──────────────────────────────────────────────────────┘
```

**Layout rules:**
- **Content area**: 2/3 width on desktop (`lg:col-span-2` of a 3-col grid).
- **Sidebar**: 1/3 width, sticky positioning. Contains search widget, related posts list, and category tags.
- **Content body**: Uses prose/typography styles. Must render arbitrary HTML (`<p>`, `<h2>`, `<h3>`, `<blockquote>`, `<ul>`, `<ol>`, `<img>`, `<code>`).
- **Tags**: Displayed as pill/chip badges after content.
- **Author box**: Avatar + name + bio, card-style container.
- **Discussion section**: Placeholder for Giscus comments at the bottom.
- On mobile: sidebar stacks below content.

### 3.5 Search Page

```
┌──────────────────────────────────────────────────────┐
│                    [HEADER]                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│           Search Results                             │
│     Found N result(s) for "query"                    │
│                                                      │
│  ┌──────────────────────────────────┬──────────┐    │
│  │                                  │          │    │
│  │  ┌──────┬───────────────────┐    │ SIDEBAR  │    │
│  │  │[Img] │ CATEGORY          │    │          │    │
│  │  │      │ Title             │    │ [Search] │    │
│  │  │      │ Excerpt...        │    │          │    │
│  │  │      │ 👤 Author • 📅    │    │ Most     │    │
│  │  └──────┴───────────────────┘    │ Read     │    │
│  │                                  │          │    │
│  │  ┌──────┬───────────────────┐    │          │    │
│  │  │[Img] │ CATEGORY          │    │          │    │
│  │  │      │ Title             │    │          │    │
│  │  │      │ Excerpt...        │    │          │    │
│  │  └──────┴───────────────────┘    │          │    │
│  │                                  │          │    │
│  └──────────────────────────────────┴──────────┘    │
│                                                      │
├──────────────────────────────────────────────────────┤
│                    [FOOTER]                          │
└──────────────────────────────────────────────────────┘
```

**Layout rules:**
- **Header banner**: Query string and result count.
- **Results list**: Horizontal card layout (image left, text right). Each card is clickable.
- **Empty state**: Show a friendly "No results found" message with an icon.
- **Sidebar**: Same structure as Single page — search widget + post list.

### 3.6 404 Page

```
┌──────────────────────────────────────────────────────┐
│                    [HEADER]                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│                    404                                │
│              Page Not Found                          │
│                                                      │
│     The page you're looking for doesn't exist.       │
│                                                      │
│              [← Back to Home]                        │
│                                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│                    [FOOTER]                          │
└──────────────────────────────────────────────────────┘
```

**Layout rules:**
- Vertically + horizontally centered.
- Large "404" text, secondary heading, description, and a CTA button.

---

## 4. Design Constraints

### Responsive Breakpoints

| Breakpoint | Width | Grid columns |
|---|---|---|
| Mobile | `< 768px` | 1 column |
| Tablet | `768px – 1023px` | 2 columns |
| Desktop | `≥ 1024px` | 3 columns (or 2/3 + 1/3 for content + sidebar) |

### Dark Mode

Every page **must** be designed in both light and dark variants.

| Token | Light | Dark |
|---|---|---|
| Page background | `#ffffff` | `#171717` (neutral-900) |
| Card background | `#f9fafb` (gray-50) | `#0a0a0a` (neutral-950) |
| Primary text | `#111827` (gray-900) | `#ffffff` |
| Secondary text | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| Border | `#f3f4f6` (gray-100) | `#262626` (neutral-800) |
| Accent | `#2563eb` (blue-600) | `#2563eb` (blue-600) |

### Typography

| Element | Size | Weight |
|---|---|---|
| Page title (Single) | 4xl → 6xl | extrabold (800) |
| Featured title (Home) | 4xl → 5xl | extrabold (800) |
| Card title | xl | bold (700) |
| Section heading | 2xl | bold (700) |
| Body text | base (16px) | normal (400) |
| Category label | xs, uppercase, tracking-wider | semibold (600) |
| Meta (author, date) | xs – sm | normal (400) |

### Interactions

| Element | Behavior |
|---|---|
| Post card | Hover: subtle shadow lift + image scale 1.05 |
| Post title | Hover: color → accent blue |
| Nav link | Hover: color → accent blue |
| All transitions | `300ms` ease, or `500ms` for image transforms |
| Images | `object-cover`, contained in rounded containers |

### Image Aspect Ratios

| Context | Ratio |
|---|---|
| Featured image (Home) | 4:3 |
| Post card thumbnail | 16:9 (aspect-video) |
| Featured image (Single) | 21:9 (ultra-wide) |
| Sidebar thumbnail | 1:1 (64×64px square) |
| Author avatar | 1:1, circular, 32–80px |

---

## 5. Content Container

All page content sits inside a centered container:

- **Max width**: `1280px` (Tailwind `container`)
- **Horizontal padding**: `16px` on mobile, larger on desktop
- **Article prose max-width**: `max-w-4xl` for readability (~896px)

---

## 6. Mockup Deliverables Checklist

When submitting a mockup, include the following:

```
[ ] Header — desktop + mobile (hamburger open state)
[ ] Footer — desktop + mobile
[ ] Home — desktop (3-col grid) + mobile (stacked)
[ ] Single — desktop (content + sidebar) + mobile (stacked)
[ ] Search — desktop + mobile + empty state
[ ] 404 — centered layout
[ ] Both light and dark variants for all pages
[ ] Placeholder data uses the exact fields from Section 2
[ ] Interactive states shown: hover on cards, links, buttons
[ ] Missing data handled: no featuredImage, no avatar, no tags
```

---

## 7. Placeholder Content for Mockups

Use this sample data to populate your mockups:

```
SITE:
  Title: "NextWP-lite"
  Tagline: "Modern Serverless CMS"
  
NAV:
  Home | Features | Blog | About

FOOTER LINKS:
  Privacy Policy | Terms of Service | Contact

FEATURED POST:
  Title: "Building a Serverless CMS with React & Next.js"
  Excerpt: "A complete guide on how we designed the NextWP-lite
            architecture using Vercel Functions and Neon Database
            for maximum performance."
  Category: Engineering
  Author: Arinadi
  Date: October 25, 2023
  Tags: #Serverless #React #Vercel

REGULAR POSTS (3–5 cards):
  1. "The Future of Web Development in 2026" — Trends
  2. "SEO Optimization for React Apps" — SEO
  3. "Minimalism in UI Design" — Design
```
