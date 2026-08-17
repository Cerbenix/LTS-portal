import { readdir, readFile, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

// Load local environment files if present
const envFiles = [".env.development.local", ".env.local", ".env"];
for (const file of envFiles) {
    const envPath = path.join(process.cwd(), file);
    if (existsSync(envPath)) {
        dotenv.config({ path: envPath });
    }
}

const dir = path.join(process.cwd(), "db");

try {
    const s = await stat(dir);
    if (!s.isDirectory()) {
        console.error("`db` exists but is not a directory. Create a `db/` directory with .sql files.");
        process.exit(1);
    }
} catch {
    console.error("No `db/` directory found. Create a `db/` directory and add your .sql migrations.");
    process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("Error: no DATABASE_URL environment variable set.");
    process.exit(1);
}

const client = new Client({ connectionString });

try {
    await client.connect();

    // Ensure migrations table exists
    await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT now()
    );
  `);

    // Collect and sort .sql files in `db/`
    const entries = await readdir(dir);
    const files = entries
        .filter((entry) => entry.endsWith(".sql"))
        .map((file) => ({ full: path.join(dir, file), rel: file }))
        .sort((a, b) => a.rel.localeCompare(b.rel));

    if (files.length === 0) {
        console.log("No .sql migration files found in", dir);
        await client.end();
        process.exit(0);
    }

    for (const { rel: file, full: fullPath } of files) {
        const already = await client.query("SELECT 1 FROM migrations WHERE filename = $1", [file]);
        if (already.rowCount && already.rowCount > 0) {
            console.log(`Skipping ${file} (already applied)`);
            continue;
        }

        const sql = await readFile(fullPath, "utf8");
        console.log(`Applying ${file}...`);
        try {
            await client.query("BEGIN");
            await client.query(sql);
            await client.query("INSERT INTO migrations (filename) VALUES ($1)", [file]);
            await client.query("COMMIT");
            console.log(`Applied ${file}`);
        } catch (err) {
            await client.query("ROLLBACK");
            const message = err instanceof Error ? err.message : String(err);
            console.error(`Failed to apply ${file}:`, message);
            await client.end();
            process.exit(1);
        }
    }

    console.log("All migrations applied.");
    await client.end();
} catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Migration runner error:", message);
    try {
        await client.end();
    } catch {}
    process.exit(1);
}
