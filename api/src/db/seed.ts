import { sql } from "drizzle-orm";
import { db, connection } from "./index.js";
import { comments, posts, users } from "./schema.js";

import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import { hashOption } from "../auth.js";

async function seed() {
    console.log("Seeding the database...");

    // Clean the tables
    console.log("Cleaning existing data...");

    await db.delete(comments);
    await db.delete(posts);
    await db.delete(users);

    db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('posts')`);
    db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('comments')`);
    db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('users')`);

    console.log("Inserting new seed data...");

    const sampleUsers = [];

    for (let i = 0; i < 10; i++) {
        const user = db
            .insert(users)
            .values({
                name: faker.person.fullName(),
                username: `user-${i}`,
                passwordHash: await hash(`password-${i}`, hashOption),
            })
            .returning()
            .get();

        sampleUsers.push(user);
    }

    for (let i = 0; i < 100; i++) {
        const content = faker.lorem.sentence({
            min: 1,
            max: 20,
        });

        const date = faker.date.recent({
            days: 10,
        });

        const post = await db
            .insert(posts)
            .values({
                content: `Post #${i} - ${content}`,
                userId: faker.helpers.arrayElement(sampleUsers).id,
                date,
            })
            .returning()
            .get();

        const howManyComments = faker.number.int({
            min: 0,
            max: 5,
        });

        for (let j = 0; j < howManyComments; j++) {
            const commentContent = faker.lorem.sentence({
                min: 1,
                max: 5,
            });

            const commentDate = faker.date.recent({
                days: 5,
            });

            await db.insert(comments).values({
                userId: faker.helpers.arrayElement(sampleUsers).id,
                content: commentContent,
                date: commentDate,
                postId: post.id,
            });
        }
    }

    console.log("Seeding completed successfully.");
}

seed()
    .catch((e) => {
        console.error("Seeding failed:");
        console.error(e);
    })
    .finally(() => {
        connection.close();
    });
