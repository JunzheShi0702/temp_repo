import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./index.js";
import { sessions, users } from "./schema.js";
import { Lucia } from "lucia";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        },
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        UserId: number;
    }
}
