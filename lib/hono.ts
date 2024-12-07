// Importing the hono client library to interact with the Hono-based API
import { hc } from "hono/client"
// Importing the AppType from the API route to define the client type
import { AppType } from "@/app/api/[[...route]]/route"
// Creating a client instance for the API using Hono's client helper
export const client = hc<AppType>(process.env.NEXT_PUBLIC_VERCEL_URL!);