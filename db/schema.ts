import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"; // Importing necessary functions from Drizzle ORM
import { createInsertSchema } from "drizzle-zod";  // Importing the Zod schema creation utility for validation
import { relations } from "drizzle-orm";
import { z } from "zod";

// Defining the accounts table schema
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),       // ID column, text type, primary key
    plaidId: text("plaid_id"),         // Plaid ID column, text type
    name: text("name").notNull(),      // Name column, text type, cannot be null
    userId: text("user_id").notNull(), // User ID column, text type, cannot be null
})

export const accountRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}))
// Creating an insert schema based on the accounts table schema
export const insertAccountSchema = createInsertSchema(accounts)

// Defining the schema for the 'categories' table
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),       // ID column, text type, serves as the primary key
    plaidId: text("plaid_id"),         // Plaid ID column, text type (optional)
    name: text("name").notNull(),      // Name column, text type, cannot be null
    userId: text("user_id").notNull(), // User ID column, text type, cannot be null
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}))

// Creating a Zod schema for validating data when inserting into the 'categories' table
export const insertCategorySchema = createInsertSchema(categories)

export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),         // ID column, text type, serves as the primary key
    amount: integer("amount").notNull(), // Amount column, integer type, cannot be null
    payee: text("payee").notNull(),      // Payee column, text type (optional)
    notes: text("notes"),                // Notes column, text type (optional)
    date: timestamp("date", { mode: "date" }).notNull(), // Date column, timestamp type, cannot be null
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade"
    }).notNull(), // Account ID column, text type, references the 'accounts' table, cannot be null
    categoryId: text("category_id"  ).references(() => categories.id, {
        onDelete: "set null"
    }), // Category ID column, text type (optional), references the 'categories' table
});

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

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
})