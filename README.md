# NextWP-lite

> Modern Serverless CMS — Built with Next.js 16, optimized for Vercel.

A lightweight, full-stack CMS with a **"Dual-Realm" architecture**: Admin UI runs as a CSR Single Page App, while the Public site uses SSR/ISR for maximum performance and SEO.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Neon (Serverless PostgreSQL) |
| **ORM** | Drizzle ORM |
| **Auth** | NextAuth.js v5 (Beta) |
| **Editor** | BlockNote (Notion-style) |
| **Media** | Vercel Blob + Local Uploads |
| **Icons** | Lucide React |
| **Deployment** | Vercel Serverless |

## Project Structure

```
src/
├── app/
│   ├── (admin)/admin/       # Admin Realm (CSR)
│   │   ├── layout.tsx       # Sidebar + Top bar shell
│   │   ├── page.tsx         # Dashboard
│   │   ├── login/           # Google OAuth login
│   │   ├── setup/           # WordPress-like install wizard
│   │   ├── posts/           # Posts list + Editor
│   │   ├── media/           # Media Library
│   │   ├── menus/           # Menu Builder
│   │   └── settings/        # Site Settings
│   ├── (public)/            # Public Realm (SSR/ISR)
│   │   ├── layout.tsx       # Header + Footer shell
│   │   ├── page.tsx         # Homepage
│   │   └── [...slug]/       # Dynamic post/page routes
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth.js handler
│   │   ├── media/           # Media API (GET/POST)
│   │   └── setup/           # DB schema deploy endpoint
│   ├── globals.css
│   └── layout.tsx           # Root layout
├── db/
│   ├── schema.ts            # Drizzle ORM schema (Media, Posts, Users)
│   └── index.ts             # Neon serverless connection
├── lib/
│   ├── utils.ts             # CN utility
│   └── session.ts           # Session helpers
├── auth.ts                  # NextAuth.js config
├── middleware.ts            # Auth middleware
├── themes/
│   └── default/             # Default theme
│       ├── components/      # Header, Footer, Sidebar
│       ├── templates/       # Home, Single, Search, NotFound
│       └── index.ts         # Theme manifest
└── types/
    └── theme.ts             # Theme data contracts
```

## Database Schema

| Table | Description |
|---|---|
| `user` | Users with roles (super_admin, editor, author, user) |
| `session` | Auth sessions (NextAuth.js) |
| `account` | OAuth accounts — Google (NextAuth.js) |
| `posts` | Content with JSONB body, UUID IDs, status, slug |
| `media` | Hybrid media (local uploads + external hotlinks) |
| `options` | Key-value site configuration |

## Getting Started

### Prerequisites

- Node.js 18+
- [Neon](https://neon.tech) database
- [Google OAuth credentials](https://console.cloud.google.com/apis/credentials)

### 1. Install

```bash
git clone <repo-url>
cd NextWP-lite
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
AUTH_SECRET=your-random-secret-key
AUTH_GOOGLE_ID=xxxxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxx
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
```

> **Google OAuth Redirect URI** — add in Google Cloud Console:
> - Dev: `http://localhost:3000/api/auth/callback/google`
> - Prod: `https://your-domain.com/api/auth/callback/google`

### 3. Run Setup Wizard

```bash
npm run dev
```

Visit **`http://localhost:3000/admin/setup`** — the setup wizard will:
1. Let you configure site title & tagline
2. Deploy all 6 database tables to Neon (one click)
3. Prompt you to sign in with Google → you become **Super Admin**

### 4. Deploy to Vercel

```bash
vercel deploy --prod
```

## Authentication

- **Google OAuth only** — no email/password
- **Invite-only** — new users must be invited by admin
- **First-User pattern** — first Google sign-in automatically becomes Super Admin
- **RBAC** — super_admin, editor, author, user roles

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Public homepage |
| `/[slug]` | Dynamic | Single post/page view |
| `/admin/setup` | Static | Setup wizard (first-time install) |
| `/admin/login` | Static | Google OAuth login |
| `/admin` | Static | Admin dashboard |
| `/admin/posts` | Static | Posts management |
| `/admin/posts/editor` | Static | Post editor |
| `/admin/media` | Static | Media library |
| `/admin/menus` | Static | Menu builder |
| `/admin/settings` | Static | Site settings |
| `/api/auth/*` | Dynamic | Better Auth API (OAuth callbacks) |
| `/api/setup` | Dynamic | DB schema deploy endpoint |

## Theme System

Themes live in `src/themes/` and follow a registry pattern. See [THEME.md](.agent/plan/THEME.md) for the full theme development guide.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth.js secret key |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret |
| `AUTH_URL` | Yes (Dev) | Auth URL (e.g. http://localhost:3000) |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob Token (for media) |

## License

MIT
