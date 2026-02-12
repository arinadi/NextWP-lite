import { pgTable, text, varchar, timestamp, boolean, uuid, jsonb, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
    value: jsonb("value"), // JSONB allows flexible config structures
    isPublic: boolean("is_public").default(false),
});

// --------------------------------------------------------------------------
// 5. Relations (Drizzle ORM v0.x API)
// --------------------------------------------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    media: many(media),
}));

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
    uploader: one(users, {
        fields: [media.uploadedBy],
        references: [users.id],
    }),
}));
