import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Accounts table schema
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
})

// Define account-to-transaction relationship
export const accountRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}))

// Creating an insert schema based on the accounts table schema
export const insertAccountSchema = createInsertSchema(accounts)

// Categories table schema
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

// Define category-to-transaction relationship
export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}))

// Creating a Zod schema for validating data when inserting into the 'categories' table
export const insertCategorySchema = createInsertSchema(categories)

// Transactions table schema
export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade"
    }).notNull(),
    categoryId: text("category_id"  ).references(() => categories.id, {
        onDelete: "set null"
    }),
});

// Define transaction relationships
export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}))

// Schema for validating transaction inserts
export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
})

export const receipts = pgTable("receipts", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    transactionId: text("transaction_id").references(() => transactions.id, { onDelete: "set null" }),
});

export const receiptsRelations = relations(receipts, ({ one }) => ({
    user: one(accounts, {
        fields: [receipts.userId],
        references: [accounts.userId],
    }),
    transaction: one(transactions, {
        fields: [receipts.transactionId],
        references: [transactions.id],
    }),
}));

export const insertReceiptSchema = createInsertSchema(receipts);