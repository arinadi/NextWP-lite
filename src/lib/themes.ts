import { db } from "@/db";
import { options } from "@/db/schema";
import { eq } from "drizzle-orm";
import defaultTheme from "@/themes/default";

// Registry of available themes
// We use static imports here to ensure the bundler includes the code
// and we avoid dynamic "require" issues in Server Components.
const themes = {
    default: defaultTheme,
} as const;

export type ThemeId = keyof typeof themes;

export async function getActiveTheme() {
    try {
        const result = await db.query.options.findFirst({
            where: eq(options.key, "active_theme"),
        });

        const themeId = (result?.value as string) || "default";

        // Return the requested theme or fallback to default
        return themes[themeId as ThemeId] || themes.default;
    } catch (error) {
        console.error("Failed to fetch active theme, falling back to default:", error);
        return themes.default;
    }
}

export function getTheme(id: string) {
    return themes[id as ThemeId] || themes.default;
}
