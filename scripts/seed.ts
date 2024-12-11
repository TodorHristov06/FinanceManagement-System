import { config } from "dotenv";
import { subDays } from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { categories, accounts, transactions } from "@/db/schema";

config({path: ".env.local"});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = "user_2nR3WhLZ4vb3aQsBGGhkLSu1cpn";
const SEED_CATEGORIES = [
    { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null },
    { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidId: null },
    { id: "category_3", name: "Utilities", userId: SEED_USER_ID, plaidId: null },
    { id: "category_7", name: "Clothing", userId: SEED_USER_ID, plaidId: null },
];

const SEED_ACCOUNT_ID = [
    { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidId: null },
    { id: "account_2", name: "Savings", userId: SEED_USER_ID, plaidId: null },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const SEED_TRANSACTIONS: typeof transactions.$inferSelect[] = [];

import { eachDayOfInterval, format } from "date-fns";
import { convertAmountToMiliunits } from "@/lib/utils";

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
    switch (category.name) {
        case "Rent":
            return Math.random() * 400 + 90;
        case "Utilities":
            return Math.random() * 200 + 50;
        case "Food":
            return Math.random() * 30 + 10;
        case "Transportation":
        case "Health":
            return Math.random() * 50 + 15;
        case "Entertainment":
        case "Clothing":
        case "Miscellaneous":
            return Math.random() * 100 + 20;
        default:
            return Math.random() * 50 + 10;
    }
}

const generateTransactionsForDay = (day: Date) => {
    const numTransactions = Math.floor(Math.random() * 4) + 1; // 1-4 transactions per day

    for (let i = 0; i < numTransactions; i++) {
        const category = SEED_CATEGORIES[Math.floor(Math.random()) * SEED_CATEGORIES.length];
        const isExpense = Math.random() > 0.6; // 60% chance of being an expense
        const amount = generateRandomAmount(category);
        const formattedAmount = convertAmountToMiliunits(isExpense ? -amount : amount); // Negative for expenses

        SEED_TRANSACTIONS.push({
            id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
            accountId: SEED_ACCOUNT_ID[0].id, // Assuming we're always using the first account
            categoryId: category.id,
            date: day,
            amount: formattedAmount,
            payee: "Merchant",
            notes: "Random transaction",
        })
    }
}

const generateTransactions = () => {
    const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
    days.forEach((day) => generateTransactionsForDay(day));
} 

generateTransactions();

const main = async () => {
    try{
        //Reset database
        await db.delete(transactions).execute();
        await db.delete(accounts).execute();
        await db.delete(categories).execute();
        //Seed categories
        await db.insert(categories).values(SEED_CATEGORIES).execute();
        //Seed accounts
        await db.insert(accounts).values(SEED_ACCOUNT_ID).execute();
        //Seed transactions
        await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
    } catch (error) {
        console.error("Error during seeding",error);
        process.exit(1);
    }
}

main();
