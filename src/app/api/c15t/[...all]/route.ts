import { c15tInstance } from "@c15t/backend/v2";
import { drizzleAdapter } from "@c15t/backend/v2/db/adapters/drizzle";
import * as c15tSchema from "@c15t/backend/v2/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NextRequest } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

// Enable Drizzle relational query builder by providing schema
const drizzleDb = drizzle(pool, { schema: c15tSchema });

const handler = c15tInstance({
  appName: "c15t-self-host",
  basePath: "/api/c15t",
  adapter: drizzleAdapter({
    db: drizzleDb,
    provider: "postgresql",
  }),
  trustedOrigins: ["localhost"], // TODO: Add the actual domain
  logger: {
    level: "error",
  },
});

const handleRequest = async (request: NextRequest) => handler.handler(request);

export { handleRequest as GET, handleRequest as OPTIONS, handleRequest as POST };
