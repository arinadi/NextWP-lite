import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db, getDb } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(getDb(), {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    session: {
        strategy: 'jwt',
    },
    debug: true,
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    pages: {
        signIn: '/admin/login',
        error: '/admin/login',
    },
    callbacks: {
        // Validation: Only registered emails (if restricted) or anyone (if open)
        // For now, allow anyone, but we can implement whitelist
        async signIn({ user }) {
            if (!user.email) return false;

            // Logic from user snippet:
            // const existingUser = await db.query.users.findFirst({ ... });
            // Since we don't have existing user status logic fully defined in a separate whitelist,
            // we will effectively allows sign in.
            // BUT, we want the "First User is Admin" logic if possible?
            // NextAuth doesn't have "databaseHooks". We do it here.

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, user.email),
            });

            // First user check:
            if (!existingUser) {
                const userCount = await db.$count(users);
                if (userCount === 0) {
                    // logic to set role to 'super_admin' is tricky here because user isn't created yet in DB
                    // NextAuth creates user AFTER this callback returns true.
                    // Method: Use 'events' configuration.
                }
            }

            return true;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                // On initial sign in, fetch role from DB
                // Logic: user might be created just now.
                // We might need to fetch it again.
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.email, token.email!),
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.status = dbUser.status;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
                // @ts-ignore
                session.user.status = token.status as string;
            }
            return session;
        }
    },
    events: {
        async createUser({ user }) {
            try {
                const { getOption } = await import("@/lib/options");
                const { runSeed } = await import("@/lib/seed");

                const userCount = await db.$count(users);

                if (userCount <= 1) {
                    // 1. Promote to Super Admin
                    await db.update(users)
                        .set({ role: "super_admin" })
                        .where(eq(users.id, user.id!));

                    console.log(`🚀 System Init: ${user.email} promoted to Super Admin.`);

                    // 2. Trigger Seeding if not already done
                    const isSeeded = await getOption('seeded');
                    if (!isSeeded) {
                        console.log(`🌱 Seeding demo content for ${user.email}...`);
                        await runSeed(user.id!);
                    }
                }
            } catch (error) {
                console.error("Error in createUser event:", error);
            }
        }
    }
})
