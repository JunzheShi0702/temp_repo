import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { signInSchema, signUpSchema } from "./validators/schema.js";
import { users } from "./db/schema.js";
import { db } from "./db/index.js";
import { hash, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { lucia } from "./db/auth.js";
import type { Context } from "./lib/context.js";
import { auth } from "./middleware/auth.js";

const authRoutes = new Hono<Context>();

export const hashOption = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
};

/// sign in
authRoutes.post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { username, password } = c.req.valid("json");

    // go look up User account by username

    const user = db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .get();

    // if no User account, return errror

    if (!user) {
        throw new HTTPException(401, {
            message: "Incorrect username or password",
        });
    }

    // make sure that the provided password matches the (hashed) password we stored
    const validPassword = await verify(user.passwordHash, password);

    if (validPassword) {
        const session = await lucia.createSession(user.id, {});

        const sessionCookie = lucia.createSessionCookie(session.id);

        c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

        return c.json({
            message: "You're signed in",
            user: {
                name: user.name,
                username: user.username,
            },
        });
    } else {
        throw new HTTPException(401, {
            message: "Incorrect username or password",
        });
    }
});

/// sign up (/register)
authRoutes.post(
    "/sign-up",
    zValidator("json", signUpSchema),

    async (c) => {
        const { name, username, password } = c.req.valid("json");

        const passwordHash = await hash(password, hashOption);

        const newUser = db
            .insert(users)
            .values({
                username,
                name,
                passwordHash,
            })
            .returning()
            .get();

        const session = await lucia.createSession(newUser.id, {});

        const sessionCookie = lucia.createSessionCookie(session.id);

        c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

        return c.json({
            message: "You're signed up",
            user: {
                name: newUser.name,
                username: newUser.username,
            },
        });
    },
);

/// sign out
authRoutes.post(
    "/sign-out",
    // auth,
    async (c) => {
        const session = c.get("session");

        if (!session) {
            throw new HTTPException(401, {
                message: "You must be signed in to sign out",
            });
        } else {
            await lucia.invalidateSession(session.id);
            const sessionCookie = lucia.createBlankSessionCookie();

            c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

            return c.json({
                message: "You've signed out",
            });
        }
    },
);

export default authRoutes;
