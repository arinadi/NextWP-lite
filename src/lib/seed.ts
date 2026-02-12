import { db } from "@/db";
import { categories, posts, options } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Runs the initial demo data seeding for the site.
 * Attributes all content to the provided userId.
 */
export async function runSeed(userId: string) {
    try {
        // 1. Create Categories
        const cats = [
            { id: '11111111-1111-1111-1111-111111111111' as any, name: 'Coding', slug: 'coding', description: 'Tutorials and snippets' },
            { id: '22222222-2222-2222-2222-222222222222' as any, name: 'Technology', slug: 'technology', description: 'Latest tech news' },
            { id: '33333333-3333-3333-3333-333333333333' as any, name: 'Vibes', slug: 'vibes', description: 'Personal thoughts' },
        ];

        for (const cat of cats) {
            await db.insert(categories).values(cat).onConflictDoNothing();
        }

        // 2. Create Pages (About, Contact)
        const pages = [
            {
                slug: 'about',
                title: 'About Me',
                content: [
                    { type: "heading", content: "About My Blog" },
                    { type: "paragraph", content: "Welcome to my personal space on the web. I write about technology, coding, and life." }
                ],
                excerpt: "Learn more about the author and this blog.",
                featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"
            },
            {
                slug: 'contact',
                title: 'Contact',
                content: [
                    { type: "heading", content: "Get in Touch" },
                    { type: "paragraph", content: "Feel free to reach out to me for collaborations or just a friendly chat." }
                ],
                excerpt: "How to reach out to the author.",
                featuredImage: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1000&auto=format&fit=crop"
            }
        ];

        for (const page of pages) {
            await db.insert(posts).values({
                slug: page.slug,
                title: page.title,
                content: page.content,
                excerpt: page.excerpt,
                type: 'page',
                status: 'published',
                authorId: userId,
                featuredImage: page.featuredImage,
                publishedAt: new Date(),
            }).onConflictDoNothing();
        }

        // 3. Create initial Posts
        const demoPosts = [
            {
                slug: 'hello-world',
                title: 'Hello World! Welcome to NextWP',
                categoryId: cats[0].id, // Coding
                excerpt: 'The journey begins here.',
                contentSnippet: "Welcome to my new blog powered by NextWP. Stay tuned for more code!",
                featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop"
            },
            {
                slug: 'why-nextjs-is-awesome',
                title: 'Why I Chose Next.js for This Project',
                categoryId: cats[1].id, // Tech
                excerpt: 'React Server Components changed everything.',
                contentSnippet: "Server-side rendering, static generation, and API routes all in one. It's the full package.",
                featuredImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop"
            },
            {
                slug: 'mastering-async-await',
                title: 'Mastering Async/Await in JavaScript',
                categoryId: cats[0].id, // Coding
                excerpt: 'Stop using callbacks. Promises are the way.',
                contentSnippet: "Async/await makes asynchronous code look synchronous. It's cleaner and easier to debug.",
                featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
            },
            {
                slug: 'coding-late-at-night',
                title: 'Late Night Coding Vibes',
                categoryId: cats[2].id, // Vibes
                excerpt: 'Coffee, Lo-Fi beats, and VS Code.',
                contentSnippet: "There's something magical about coding when the world is asleep. Focus is at 100%.",
                featuredImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop"
            }
        ];

        for (const post of demoPosts) {
            const blocks = [
                { type: "heading", content: post.title },
                { type: "paragraph", content: post.contentSnippet }
            ];
            await db.insert(posts).values({
                slug: post.slug,
                title: post.title,
                content: blocks,
                excerpt: post.excerpt,
                type: 'post',
                status: 'published',
                authorId: userId,
                categoryId: post.categoryId,
                featuredImage: post.featuredImage,
                publishedAt: new Date(),
            }).onConflictDoNothing();
        }

        // 4. Mark as seeded
        await db.insert(options).values({
            key: 'seeded',
            value: true
        }).onConflictDoUpdate({
            target: options.key,
            set: { value: true }
        });

        console.log(`✅ Database seeded successfully for user ${userId}`);
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
}
