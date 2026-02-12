import { db } from "@/db";
import { options } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get a single option by key and parse its JSON value.
 */
export async function getOption<T = any>(key: string): Promise<T | null> {
    try {
        const result = await db
            .select()
            .from(options)
            .where(eq(options.key, key))
            .limit(1);

        if (result.length === 0) return null;

        const value = result[0].value;
        if (typeof value === "string") {
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as unknown as T;
            }
        }
        return value as T;
    } catch (error) {
        console.error(`Failed to fetch option "${key}":`, error);
        return null;
    }
}

/**
 * Get multiple options and return them as a key-value object.
 */
export async function getOptions(keys: string[]): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    for (const key of keys) {
        results[key] = await getOption(key);
    }
    return results;
}
