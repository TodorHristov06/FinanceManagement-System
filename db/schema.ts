import { pgTable, text } from "drizzle-orm/pg-core"; // Importing necessary functions from Drizzle ORM
import { createInsertSchema } from "drizzle-zod";  // Importing the Zod schema creation utility for validation

// Defining the accounts table schema
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),       // ID column, text type, primary key
    plaidId: text("plaid_id"),         // Plaid ID column, text type
    name: text("name").notNull(),      // Name column, text type, cannot be null
    userId: text("user_id").notNull(), // User ID column, text type, cannot be null
})

// Creating an insert schema based on the accounts table schema
export const insertAccountSchema = createInsertSchema(accounts)

// Defining the schema for the 'categories' table
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),       // ID column, text type, serves as the primary key
    plaidId: text("plaid_id"),         // Plaid ID column, text type (optional)
    name: text("name").notNull(),      // Name column, text type, cannot be null
    userId: text("user_id").notNull(), // User ID column, text type, cannot be null
});

export const insertCategorySchema = createInsertSchema(categories)