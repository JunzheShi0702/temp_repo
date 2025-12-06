import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export async function authGuard(c: Context, next: Next) {
    const session = c.get("session");

    if (!session)
        throw new HTTPException(401, {
            message: "You must be logged in to perform that operation!",
        });

    return next();
}
