import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { admin } from "better-auth/plugins";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    // Email/password disabled — Google OAuth only
    emailAndPassword: {
        enabled: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [admin()],
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // "First-User" pattern: first account → Super Admin
                    const userCount = await db.$count(users);

                    if (userCount === 1) {
                        await db.update(users)
                            .set({ role: "super_admin" })
                            .where(eq(users.id, user.id));

                        console.log(`🚀 System Init: ${user.email} promoted to Super Admin.`);
                    }
                },
            },
        },
    },
});
