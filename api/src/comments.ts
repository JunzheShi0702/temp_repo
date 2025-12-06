import { Hono } from "hono";
import { db } from "./db/index.js";
import { comments, users } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import {
    createCommentSchema,
    getCommentSchema,
    getCommentsSchema,
    updateCommentSchema,
} from "./validators/schema.js";
import type { Context } from "./lib/context.js";
import { authGuard } from "./middleware/auth-guard.js";

const commentRoutes = new Hono<Context>();

commentRoutes.get(
    "/posts/:postId/comments",
    zValidator("param", getCommentsSchema),
    async (c) => {
        const { postId } = c.req.valid("param");
        const allComments = await db
            .select({
                id: comments.id,
                content: comments.content,
                date: comments.date,
                author: {
                    id: users.id,
                    name: users.name,
                    username: users.username,
                    postId: comments.postId,
                },
            })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(eq(comments.postId, postId));

        return c.json(allComments);
    },
);

commentRoutes.get(
    "/posts/:postId/comments/:commentId",
    zValidator("param", getCommentSchema),
    async (c) => {
        const { postId, commentId } = c.req.valid("param");

        const comment = db
            .select({
                id: comments.id,
                content: comments.content,
                date: comments.date,
                postId: comments.postId,
                author: {
                    id: users.id,
                    name: users.name,
                    username: users.username,
                },
            })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
            .get();

        if (!comment) {
            throw new HTTPException(404, { message: "Wasn't there" });
        }

        return c.json(comment);
    },
);

commentRoutes.delete(
    "/posts/:postId/comments/:commentId",
    zValidator("param", getCommentSchema),
    async (c) => {
        const { postId, commentId } = c.req.valid("param");

        const user = c.get("user");

        const comment = db
            .select()
            .from(comments)
            .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
            .get();

        if (!comment) {
            throw new HTTPException(404, { message: "Wasn't there" });
        }

        if (comment.userId !== user!.id) {
            throw new HTTPException(403, {
                message: "You ain't get permission to do that one",
            });
        }

        const deletedComment = await db
            .delete(comments)
            .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
            .returning()
            .get();

        return c.json(deletedComment);
    },
);

commentRoutes.post(
    "/posts/:postId/comments",
    authGuard,
    zValidator("param", getCommentsSchema),
    zValidator("json", createCommentSchema),
    async (c) => {
        const postId = parseInt(c.req.param("postId"));
        const { content } = await c.req.json();

        const user = c.get("user");

        const newComment = db
            .insert(comments)
            .values({
                content,
                date: new Date(),
                postId,
                userId: user!.id,
            })
            .returning()
            .get();

        return c.json(newComment);
    },
);

commentRoutes.patch(
    "/posts/:postId/comments/:commentId",
    authGuard,
    zValidator("param", getCommentSchema),
    zValidator("json", updateCommentSchema),
    async (c) => {
        const { postId, commentId } = c.req.valid("param");
        const { content } = c.req.valid("json");

        const user = c.get("user");

        const comment = db
            .select()
            .from(comments)
            .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
            .get();

        if (!comment) {
            throw new HTTPException(404, { message: "Wasn't there" });
        }

        if (comment.userId !== user!.id) {
            throw new HTTPException(403, {
                message: "You ain't get permission to do that one",
            });
        }

        const updatedComment = db
            .update(comments)
            .set({ content })
            .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
            .returning()
            .get();

        if (!updatedComment) {
            throw new HTTPException(404, { message: "Wasn't there" });
        }
        return c.json(updatedComment);
    },
);

export default commentRoutes;
