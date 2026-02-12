import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Post } from "@/types/theme";

/**
 * Transform a DB post row into the theme Post type.
 */
function toThemePost(row: {
    post: typeof posts.$inferSelect;
    author: typeof users.$inferSelect | null;
}): Post {
    return {
        id: row.post.id,
        title: row.post.title,
        slug: row.post.slug,
        excerpt: row.post.excerpt || "",
        content: typeof row.post.content === "string"
            ? row.post.content
            : JSON.stringify(row.post.content),
        featuredImage: row.post.featuredImage || undefined,
        author: {
            name: row.author?.name || "Unknown",
            avatar: row.author?.image || undefined,
        },
        publishedAt: row.post.publishedAt?.toISOString()
            || row.post.createdAt?.toISOString()
            || new Date().toISOString(),
        category: undefined,
        tags: [],
    };
}

/**
 * Get all published posts, ordered by most recent first.
 */
export async function getPublishedPosts(limit = 20): Promise<Post[]> {
    try {
        const rows = await db
            .select()
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.status, "published"))
            .orderBy(desc(posts.publishedAt))
            .limit(limit);

        return rows.map((row) => toThemePost({ post: row.posts, author: row.user }));
    } catch (error) {
        console.error("Failed to fetch published posts:", error);
        return [];
    }
}

/**
 * Get a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const rows = await db
            .select()
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.slug, slug))
            .limit(1);

        if (rows.length === 0) return null;

        return toThemePost({ post: rows[0].posts, author: rows[0].user });
    } catch (error) {
        console.error(`Failed to fetch post with slug "${slug}":`, error);
        return null;
    }
}
