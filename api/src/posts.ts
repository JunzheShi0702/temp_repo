import { Hono } from "hono";
import { db } from "./db/index.js";
import { posts, users } from "./db/schema.js";
import { eq, asc, desc, like, count, SQL, and } from "drizzle-orm";
import {
    createPostSchema,
    getPostSchema,
    queryParamsSchema,
    updatePostSchema,
} from "./validators/schema.js";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { authGuard } from "./middleware/auth-guard.js";
import type { Context } from "./lib/context.js";

const postRoutes = new Hono<Context>();

postRoutes.get("/posts", zValidator("query", queryParamsSchema), async (c) => {
    const {
        sort,
        search,
        page = 1,
        limit = 10,
        username,
    } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];
    if (search) {
        whereClause.push(like(posts.content, `%${search}%`));
    }

    if (username) {
        const user = db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .get();
        if (!user) {
            throw new HTTPException(404, { message: "User not exists" });
        }

        whereClause.push(eq(posts.userId, user.id));
    }

    const orderByClause: SQL[] = [];
    if (sort === "desc") {
        orderByClause.push(desc(posts.date));
    } else if (sort === "asc") {
        orderByClause.push(asc(posts.date));
    }

    const offset = (page - 1) * limit;

    const request = Promise.all([
        db
            .select({
                id: posts.id,
                content: posts.content,
                date: posts.date,
                author: {
                    name: users.name,
                    username: users.username,
                    id: users.id,
                },
            })
            .from(posts)
            .leftJoin(users, eq(posts.userId, users.id))
            .where(and(...whereClause))
            .orderBy(...orderByClause)
            .limit(limit)
            .offset(offset),
        db
            .select({ totalPosts: count() })
            .from(posts)
            .where(and(...whereClause)),
    ]);

    const response = await request;
    const [postsData, [{ totalPosts }]] = response;

    return c.json({
        data: postsData,
        page,
        limit,
        total: totalPosts,
    });
});

postRoutes.get("/posts/:id", zValidator("param", getPostSchema), (c) => {
    const { id } = c.req.valid("param");

    const post = db
        .select({
            id: posts.id,
            content: posts.content,
            date: posts.date,
            author: {
                name: users.name,
                username: users.username,
                id: users.id,
            },
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(eq(posts.id, id))
        .get();

    if (!post) throw new HTTPException(404, { message: "Post not found!" });
    return c.json(post);
});

postRoutes.delete(
    "/posts/:id",

    authGuard,

    zValidator("param", getPostSchema),

    (c) => {
        const id = parseInt(c.req.param("id"));

        const user = c.get("user");

        const post = db.select().from(posts).where(eq(posts.id, id)).get();

        if (!post) throw new HTTPException(404, { message: "Post not found!" });

        if (post.userId !== user!.id) {
            throw new HTTPException(403, {
                message: "You do not have permission to delete this post",
            });
        }

        const deletedPost = db
            .delete(posts)
            .where(eq(posts.id, id))
            .returning()
            .get();

        return c.json(deletedPost);
    },
);

postRoutes.post(
    "/posts",

    authGuard,

    zValidator("json", createPostSchema),

    async (c) => {
        const { content } = c.req.valid("json");
        const user = c.get("user");

        const newPost = {
            content,
            date: new Date(),
            userId: user!.id,
        };

        const actualNewPost = db
            .insert(posts)
            .values(newPost)
            .returning()
            .get();

        return c.json(actualNewPost);
    },
);

postRoutes.patch(
    "/posts/:id",

    authGuard,

    zValidator("param", getPostSchema),
    zValidator("json", updatePostSchema),
    async (c) => {
        const body = c.req.valid("json");
        const { content } = body;
        const { id } = c.req.valid("param");

        const user = c.get("user");

        const post = db.select().from(posts).where(eq(posts.id, id)).get();

        if (!post) throw new HTTPException(404, { message: "Post not found!" });

        if (post.userId !== user!.id) {
            throw new HTTPException(403, {
                message: "You do not have permission to update this post",
            });
        }

        const updatedPost = db
            .update(posts)
            .set({ content })
            .where(eq(posts.id, id))
            .returning()
            .get();

        return c.json(updatedPost);
    },
);

export default postRoutes;
