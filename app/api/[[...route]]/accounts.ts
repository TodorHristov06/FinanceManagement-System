// Import required libraries and modules
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { createId} from "@paralleldrive/cuid2";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, and, inArray } from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import { z } from "zod";

// Initialize Hono app
const app = new Hono()

    // GET request to fetch all user accounts
    .get(
        "/",
        clerkMiddleware(), // Auth check
         async (c) => {
            const auth = getAuth(c);

            if(!auth?.userId){
                return c.json({ error: "Unauthorized" }, 401);
            }
            // Retrieve accounts for the authenticated user 
            const data = await db
                .select({
                    id: accounts.id,
                    name: accounts.name,
                })
            .from(accounts)
            .where(eq(accounts.userId, auth.userId));
            return c.json({ data });
    })
    // GET request to fetch a single account by ID
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param")
            
            if(!id){
                return c.json({ error: "Missing id" }, 400);
            }
            
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            // Retrieve specific account for the user by ID
            const [data] = await db
                .select({
                    id: accounts.id,
                    name: accounts.name,
                })
            .from(accounts)
            .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

            if (!data){
                return c.json({ error: "Account not found" }, 404);
            }
            return c.json({ data });
        }
    )
     // POST request to create a new account
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountSchema.pick({
            name: true,
        })),
        async(c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json")

            if(!auth?.userId){
                return c.json({ error: "Unauthorized" }, 401);
            }
            // Insert new account for the user
            const [data] = await db.insert(accounts).values({
                id: createId(),
                userId: auth.userId,
                ...values,
            }).returning(); 
            return c.json({ data })
    })
    // POST request for bulk deletion of accounts
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string()), // Array of account IDs to delete
            }),
        ),
        async(c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json")

            if(!auth?.userId){
                return c.json({ error: "Unauthorized" }, 401);
            }
            // Delete multiple accounts by IDs
            const data = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(accounts.id, values.ids),
                    )
                )
                .returning({
                    id: accounts.id,
                })
                
            return c.json({ data });
        }
    )
    // PATCH request to update an account by ID
    .patch(
        "/:id", 
        clerkMiddleware(),
        zValidator(
            "param", 
            z.object({
                id: z.string().optional(),
            }),
        ),
        zValidator(
            "json",
            insertAccountSchema.pick({
                name: true,
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param")
            const values = c.req.valid("json")  

            if(!id){
                return c.json({ error: "Missing id" }, 400);
            }
            
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            // Update specific account by ID
            const [data] = await db
                .update(accounts)
                .set(values)
                .where(
                    and(
                        eq(accounts.userId, auth.userId), 
                        eq(accounts.id, id))
                )
                .returning();
            if (!data){
                return c.json({ error: "Account not found" }, 404);
            }
            return c.json({ data });
        }
    )
    // DELETE request to remove a single account by ID
    .delete(
        "/:id", 
        clerkMiddleware(),
        zValidator(
            "param", 
            z.object({
                id: z.string().optional(),
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param") 

            if(!id){
                return c.json({ error: "Missing id" }, 400);
            }
            
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            // Delete specific account by ID
            const [data] = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId), 
                        eq(accounts.id, id))
                )
                .returning({
                    id: accounts.id
                });
            if (!data){
                return c.json({ error: "Account not found" }, 404);
            }
            return c.json({ data });
        }
    )

export default app;