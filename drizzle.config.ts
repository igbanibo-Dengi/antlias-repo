// filepath: c:\Users\dengi\Desktop\Projects\e-coomerce-store\drizzle.config.ts
import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

// Explicitly load .env.local
loadEnv({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL ?? "";

const drizzleConfig = {
    schema: "database/drizzle/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: { url: DATABASE_URL },
} satisfies Config;

export default defineConfig(drizzleConfig);
