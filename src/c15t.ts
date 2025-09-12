import { c15tInstance } from "@c15t/backend/v2";
import { drizzleAdapter } from "@c15t/backend/v2/db/adapters/drizzle";
import * as c15tSchema from "@c15t/backend/v2/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NextRequest } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

// Enable Drizzle relational query builder by providing schema
const drizzleDb = drizzle(pool, { schema: c15tSchema });

export const handler = c15tInstance({
  appName: "c15t-self-host",
  basePath: "/",
  adapter: drizzleAdapter({
    db: drizzleDb,
    provider: "postgresql",
  }),
  trustedOrigins: ["localhost"], // TODO: Add the actual domain
  advanced: {
    disableGeoLocation: true,
    openapi: {
      enabled: true,
    },
  },
  logger: {
    level: "error",
  },
});

export const handleRequest = async (request: NextRequest) => handler.handler(request);
