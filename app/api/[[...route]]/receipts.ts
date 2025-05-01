// app/api/[[...route]]/receipts.ts
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, and } from "drizzle-orm";
import { receipts } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    const { userId, transactionId } = c.req.query();

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.query.receipts.findMany({
      where: and(
        eq(receipts.userId, auth.userId),
        transactionId ? eq(receipts.transactionId, transactionId) : undefined
      ),
      orderBy: (receipts, { desc }) => [desc(receipts.createdAt)],
    });

    return c.json({ data });
  })
  .post("/", clerkMiddleware(), async (c) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
      const formData = await c.req.formData();
      const file = formData.get("file") as File | null;
      const userId = formData.get("userId") as string | null;
      const transactionId = formData.get("transactionId") as string | null;
  
      if (!file || !userId) {
        return c.json({ error: "Missing file or userId" }, 400);
      }
  
      if (file.size > MAX_FILE_SIZE) {
        return c.json({ error: "File size exceeds 5MB limit" }, 400);
      }
  
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;
  
      const [receipt] = await db.insert(receipts).values({
        id: createId(),
        userId: auth.userId,
        transactionId: transactionId || null,
        imageData: dataUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }).returning();
  
      return c.json({ data: receipt }, 201);
    } catch (error) {
      console.error("Error in POST /receipts:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .delete("/:id", clerkMiddleware(), async (c) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const id = c.req.param("id");
      
      const [deletedReceipt] = await db
        .delete(receipts)
        .where(and(
          eq(receipts.id, id),
          eq(receipts.userId, auth.userId)
        ))
        .returning();

      if (!deletedReceipt) {
        return c.json({ error: "Receipt not found" }, 404);
      }

      return c.json({ data: deletedReceipt });
    } catch (error) {
      console.error("Error in DELETE /receipts/:id:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })

export default app;