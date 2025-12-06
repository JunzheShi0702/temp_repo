import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    date: integer("date", { mode: "timestamp" }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const comments = sqliteTable("comments", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    date: integer("date", { mode: "timestamp" }),
    postId: integer("post_id")
        .notNull()
        .references(() => posts.id, {
            onDelete: "cascade",
        }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    username: text("username").unique().notNull(),
    passwordHash: text("password_hash").notNull(),
});

export const sessions = sqliteTable("sessions", {
    id: text("id").notNull().primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    expiresAt: integer("expires_at").notNull(),
});
