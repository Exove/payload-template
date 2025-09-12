import { defineConfig } from "@c15t/backend/v2";
import { kyselyAdapter } from "@c15t/backend/v2/db/adapters/kysely";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

const database = new Database("./c15t.sqlite");
database.pragma("foreign_keys = ON");

const db = new Kysely({
  dialect: new SqliteDialect({
    database,
  }),
});

export default defineConfig({
  adapter: kyselyAdapter({ provider: "sqlite", db }),
});
