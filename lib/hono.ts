import { hc } from "hono/client"
import { AppType } from "@/app/api/[[...route]]/route"
// Creating a client instance for the API using Hono's client helper
export const client = hc<AppType>(process.env.NEXT_PUBLIC_VERCEL_URL!);