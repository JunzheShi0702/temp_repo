import { Hono } from "hono";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import authRoutes from "./auth.js";
import { logger } from "hono/logger";
import { auth } from "./middleware/auth.js";

const app = new Hono();

app.use(auth);

app.use(
    "/*",
    cors({
        origin: (origin) => origin, // Allow any origin
        credentials: true, // Allow credentials
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["Set-Cookie"],
    }),
);

app.use(logger());

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json(
        {
            message: "An unexpected error occurred",
        },
        500,
    );
});

app.get("/", (c) => {
    return c.text("Hello FSJS!");
});

app.route("/", postRoutes);

app.route("/", commentRoutes);

app.route("/", authRoutes);

export default app;
