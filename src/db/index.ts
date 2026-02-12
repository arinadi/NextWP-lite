import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy-init: avoid crashing at build time when DATABASE_URL is not set
let _db: ReturnType<typeof createDb> | null = null;

function createDb() {
    const sql = neon(process.env.DATABASE_URL!);
    return drizzle(sql, { schema });
}

export function getDb() {
    if (!_db) {
        _db = createDb();
    }
    return _db;
}

// Re-export for convenience — callers use `db` directly at runtime
// At build time, this is null but never actually invoked
export const db = new Proxy({} as ReturnType<typeof createDb>, {
    get(_target, prop, receiver) {
        const instance = getDb();
        const value = Reflect.get(instance, prop, receiver);
        return typeof value === "function" ? value.bind(instance) : value;
    },
});
