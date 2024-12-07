// Import necessary modules
import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories  from "./categories";
import transactions from "./transactions";

export const runtime = "edge"; // Set runtime to Vercel Edge

// Initialize Hono app with a base path
const app = new Hono().basePath("/api");

// Route all requests to /accounts to the accounts module
const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/transactions", transactions);

// Export handlers for each HTTP method
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// Define AppType for type-checking routes
export type AppType = typeof routes;
