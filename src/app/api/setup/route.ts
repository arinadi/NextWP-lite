import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

/**
 * POST /api/setup — Deploy database schema (like WordPress install)
 * Only works if tables don't exist yet (idempotent via IF NOT EXISTS)
 */
export async function POST() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json(
                { error: "DATABASE_URL is not configured" },
                { status: 500 }
            );
        }

        const sql = neon(process.env.DATABASE_URL);

        // Execute schema creation (all tables with IF NOT EXISTS)
        await sql`
            -- 1. Users (Better Auth compatible)
            CREATE TABLE IF NOT EXISTS "user" (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                email_verified BOOLEAN NOT NULL DEFAULT false,
                image TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                role TEXT DEFAULT 'user',
                banned BOOLEAN,
                ban_reason TEXT,
                ban_expires TIMESTAMP
            );
        `;

        await sql`
            -- 2. Sessions (Better Auth compatible)
            CREATE TABLE IF NOT EXISTS "session" (
                id TEXT PRIMARY KEY,
                expires_at TIMESTAMP NOT NULL,
                token TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                ip_address TEXT,
                user_agent TEXT,
                user_id TEXT NOT NULL REFERENCES "user"(id)
            );
        `;

        await sql`
            -- 3. Accounts (Better Auth compatible)
            CREATE TABLE IF NOT EXISTS "account" (
                id TEXT PRIMARY KEY,
                account_id TEXT NOT NULL,
                provider_id TEXT NOT NULL,
                user_id TEXT NOT NULL REFERENCES "user"(id),
                access_token TEXT,
                refresh_token TEXT,
                id_token TEXT,
                expires_at TIMESTAMP,
                password TEXT
            );
        `;

        await sql`
            -- 4. Posts
            CREATE TABLE IF NOT EXISTS "posts" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                slug VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                content JSONB NOT NULL,
                excerpt TEXT,
                status TEXT DEFAULT 'draft',
                featured_image VARCHAR,
                allow_comments BOOLEAN DEFAULT true,
                author_id TEXT NOT NULL REFERENCES "user"(id),
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now(),
                published_at TIMESTAMP
            );
        `;

        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS slug_idx ON posts(slug);
        `;

        await sql`
            -- 5. Media
            CREATE TABLE IF NOT EXISTS "media" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                url VARCHAR NOT NULL,
                source TEXT DEFAULT 'local',
                type VARCHAR NOT NULL,
                alt_text VARCHAR,
                width INTEGER,
                height INTEGER,
                size INTEGER,
                uploaded_by TEXT REFERENCES "user"(id),
                uploaded_at TIMESTAMP DEFAULT now()
            );
        `;

        await sql`
            -- 6. Options (Key-Value config)
            CREATE TABLE IF NOT EXISTS "options" (
                key VARCHAR PRIMARY KEY,
                value JSONB,
                is_public BOOLEAN DEFAULT false
            );
        `;

        // Mark as installed
        await sql`
            INSERT INTO "options" (key, value, is_public)
            VALUES ('installed', 'true'::jsonb, false)
            ON CONFLICT (key) DO NOTHING;
        `;

        return NextResponse.json({ success: true, message: "Database schema deployed successfully!" });
    } catch (error) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to deploy schema" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/setup — Check if already installed
 */
export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ installed: false, reason: "no_database_url" });
        }

        const sql = neon(process.env.DATABASE_URL);

        // Check if options table exists and has 'installed' key
        const result = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'options'
            ) as table_exists;
        `;

        if (!result[0]?.table_exists) {
            return NextResponse.json({ installed: false, reason: "no_tables" });
        }

        const installed = await sql`
            SELECT value FROM "options" WHERE key = 'installed';
        `;

        return NextResponse.json({
            installed: installed.length > 0,
        });
    } catch {
        return NextResponse.json({ installed: false, reason: "connection_error" });
    }
}
