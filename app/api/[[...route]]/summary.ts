import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { subDays, parse, differenceInDays } from "date-fns";
import { Hono } from "hono";
import { z } from "zod";
import {accounts, categories, transactions} from "@/db/schema";
import { and, eq, gte, lt, lte, sql, sum, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(), // Middleware for authentication
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c); // Get the authenticated user
            const { from, to, accountId } = c.req.valid("query")

            // Ensure user is authenticated
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // Set default date range if no `from` or `to` parameters are provided
            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from 
                ? parse(from, "yyyy-MM-dd", new Date()) 
                : defaultFrom;
            const endDate = to
                ? parse(to, "yyyy-MM-dd", new Date()) 
                : defaultTo;

            // Calculate period length and previous period for comparison
            const periodLength = differenceInDays(endDate, startDate) + 1;
            const lastPeriodStart = subDays(startDate, periodLength);
            const lastPeriodEnd = subDays(endDate, periodLength);

            // Function to fetch financial data (income, expenses, and remaining balance)
            async function fetchFinancialData(
                userId: string,
                startDate: Date,
                endDate: Date
            ) {
                return await db
                    .select({
                        income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                        expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                        remaining: sum(transactions.amount).mapWith(Number),
                    })
                    .from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            accountId ? eq(transactions.accountId, accountId) : undefined,
                            eq(accounts.userId, userId),
                            gte(transactions.date, startDate),
                            lte(transactions.date, endDate),
                        )
                    )
            }

            // Fetch financial data for the current period
            const [currentPeriod] = await fetchFinancialData(
                auth.userId,
                startDate,
                endDate
            );
            // Fetch financial data for the last period for comparison
            const [lastPeriod] = await fetchFinancialData(
                auth.userId,
                lastPeriodStart,
                lastPeriodEnd
            );

            // Calculate percentage change in income, expenses, and remaining balance
            const incomeChange = calculatePercentageChange(
                currentPeriod.income,
                lastPeriod.income
            )

            const expensesChange = calculatePercentageChange(
                currentPeriod.expenses,
                lastPeriod.expenses
            )

            const remainingChange = calculatePercentageChange(
                currentPeriod.remaining,
                lastPeriod.remaining
            )

            // Fetch transaction categories and sum up expenses for each category
            const category = await db
                .select({
                    name: categories.name,
                    value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .innerJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.   userId),
                        lt(transactions.amount, 0),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    )
                )
                .groupBy(categories.name)
                .orderBy(desc(
                    sql`SUM(ABS(${transactions.amount}))`
                ));
            
            // Get the top 3 categories and combine others into "Other"
            const topCategories = category.slice(0, 3);
            const otherCategories = category.slice(3);
            const otherSum = otherCategories
                .reduce((sum, current) => sum + current.value, 0);

            const finalCategories = topCategories;
            if (otherCategories.length > 0) {
                finalCategories.push({
                    name: "Other",
                    value: otherSum
                })
            }

            // Fetch daily transaction data to calculate active days and financial activities
            const activeDays = await db
                .select({
                    date: transactions.date,
                    income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ? 
                        eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    )
                )
                .groupBy(transactions.date)
                .orderBy(transactions.date);
            
            // Fill missing days in the transaction data
            const days = fillMissingDays(
                activeDays, 
                startDate, 
                endDate
            );
               
            // Return the financial summary data as JSON
            return c.json({
                data: {
                    remainingAmount: currentPeriod.remaining,
                    remainingChange,
                    incomeAmount: currentPeriod.income,
                    incomeChange,
                    expensesAmount: currentPeriod.expenses,
                    expensesChange,
                    categories: finalCategories,
                    days,
                }
            })
        }
    )

export default app;