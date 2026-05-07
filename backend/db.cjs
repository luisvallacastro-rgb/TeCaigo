const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "tecaigo.sqlite");
const EVENTS_SEED_FILE = path.join(DATA_DIR, "events.json");
const REGISTRATIONS_SEED_FILE = path.join(DATA_DIR, "registrations.json");

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function runSql(sql, options = {}) {
  const args = [DB_FILE];
  if (options.json) args.push("-json");
  args.push(sql);
  const { stdout } = await execFileAsync("sqlite3", args, { maxBuffer: 5 * 1024 * 1024 });
  return stdout.trim();
}

async function readJsonFile(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    return fallback;
  }
}

async function countRows(tableName) {
  const output = await runSql(`SELECT COUNT(*) AS count FROM ${tableName};`, { json: true });
  return JSON.parse(output || "[]")[0]?.count || 0;
}

async function initDatabase() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await runSql(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  if ((await countRows("events")) === 0) {
    const events = await readJsonFile(EVENTS_SEED_FILE, []);
    for (const event of events) {
      await upsertEvent(event);
    }
  }

  if ((await countRows("registrations")) === 0) {
    const registrations = await readJsonFile(REGISTRATIONS_SEED_FILE, []);
    for (const registration of registrations) {
      await insertRegistration(registration);
    }
  }
}

async function getEvents() {
  const output = await runSql("SELECT payload FROM events ORDER BY updated_at DESC;", { json: true });
  return JSON.parse(output || "[]").map((row) => JSON.parse(row.payload));
}

async function getEventById(id) {
  const output = await runSql(`SELECT payload FROM events WHERE id = ${sqlValue(id)} LIMIT 1;`, { json: true });
  const row = JSON.parse(output || "[]")[0];
  return row ? JSON.parse(row.payload) : null;
}

async function upsertEvent(event) {
  const now = new Date().toISOString();
  const createdAt = event.createdAt || now;
  const payload = JSON.stringify({ ...event, createdAt, updatedAt: now });
  await runSql(`
    INSERT INTO events (id, payload, created_at, updated_at)
    VALUES (${sqlValue(event.id)}, ${sqlValue(payload)}, ${sqlValue(createdAt)}, ${sqlValue(now)})
    ON CONFLICT(id) DO UPDATE SET
      payload = excluded.payload,
      updated_at = excluded.updated_at;
  `);
  return JSON.parse(payload);
}

async function getRegistrations() {
  const output = await runSql("SELECT payload FROM registrations ORDER BY created_at DESC;", { json: true });
  return JSON.parse(output || "[]").map((row) => JSON.parse(row.payload));
}

async function insertRegistration(registration) {
  const now = new Date().toISOString();
  const createdAt = registration.createdAt || now;
  const payload = JSON.stringify({ ...registration, createdAt, updatedAt: now });
  await runSql(`
    INSERT INTO registrations (id, payload, created_at, updated_at)
    VALUES (${sqlValue(registration.id)}, ${sqlValue(payload)}, ${sqlValue(createdAt)}, ${sqlValue(now)});
  `);
  return JSON.parse(payload);
}

async function getSummary() {
  const eventCount = await countRows("events");
  const registrationCount = await countRows("registrations");
  return {
    storage: "sqlite",
    database: DB_FILE,
    eventCount,
    registrationCount,
  };
}

module.exports = {
  DB_FILE,
  getEventById,
  getEvents,
  getRegistrations,
  getSummary,
  initDatabase,
  insertRegistration,
  upsertEvent,
};
