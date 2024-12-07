import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
// Establish connection to Neon database using the DATABASE_URL from environment variables
export const sql = neon(process.env.DATABASE_URL!);
// Initialize Drizzle ORM with the Neon connection and schema definitions
export const db = drizzle(sql, {schema});
