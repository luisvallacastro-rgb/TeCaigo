let Pool;
try {
  ({ Pool } = require("pg"));
} catch (error) {
  Pool = null;
}

const DATABASE_URL = process.env.DATABASE_URL;
let pool;

function getPool() {
  if (!Pool) {
    throw new Error("Falta instalar la dependencia 'pg'. En produccion la instala package.json.");
  }
  if (!DATABASE_URL) {
    throw new Error("Falta DATABASE_URL para conectar PostgreSQL.");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function initDatabase() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS events_payload_title_idx ON events ((payload ->> 'title'));
    CREATE INDEX IF NOT EXISTS events_payload_state_idx ON events ((payload ->> 'state'));
    CREATE INDEX IF NOT EXISTS events_payload_cluster_idx ON events ((payload ->> 'cluster'));

    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS registrations_company_idx ON registrations ((payload ->> 'companyName'));
    CREATE INDEX IF NOT EXISTS registrations_user_type_idx ON registrations ((payload ->> 'userType'));
    CREATE INDEX IF NOT EXISTS registrations_status_idx ON registrations ((payload ->> 'status'));

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS reservations_event_idx ON reservations ((payload ->> 'eventTitle'));
    CREATE INDEX IF NOT EXISTS reservations_source_idx ON reservations ((payload ->> 'source'));
    CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations ((payload ->> 'status'));
  `);
}

async function getEvents() {
  const result = await getPool().query("SELECT payload FROM events ORDER BY updated_at DESC;");
  return result.rows.map((row) => row.payload);
}

async function getEventById(id) {
  const result = await getPool().query("SELECT payload FROM events WHERE id = $1 LIMIT 1;", [id]);
  return result.rows[0]?.payload || null;
}

async function upsertEvent(event) {
  const now = new Date().toISOString();
  const createdAt = event.createdAt || now;
  const payload = { ...event, createdAt, updatedAt: now };

  await getPool().query(
    `INSERT INTO events (id, payload, created_at, updated_at)
     VALUES ($1, $2::jsonb, $3, $4)
     ON CONFLICT(id) DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at;`,
    [event.id, JSON.stringify(payload), createdAt, now]
  );
  return payload;
}

async function getRegistrations() {
  const result = await getPool().query("SELECT payload FROM registrations ORDER BY created_at DESC;");
  return result.rows.map((row) => row.payload);
}

async function insertRegistration(registration) {
  const now = new Date().toISOString();
  const createdAt = registration.createdAt || now;
  const payload = { ...registration, createdAt, updatedAt: now };

  await getPool().query(
    `INSERT INTO registrations (id, payload, created_at, updated_at)
     VALUES ($1, $2::jsonb, $3, $4);`,
    [registration.id, JSON.stringify(payload), createdAt, now]
  );
  return payload;
}

async function getReservations() {
  const result = await getPool().query("SELECT payload FROM reservations ORDER BY created_at DESC;");
  return result.rows.map((row) => row.payload);
}

async function insertReservation(reservation) {
  const now = new Date().toISOString();
  const createdAt = reservation.createdAt || now;
  const payload = { ...reservation, createdAt, updatedAt: now };

  await getPool().query(
    `INSERT INTO reservations (id, payload, created_at, updated_at)
     VALUES ($1, $2::jsonb, $3, $4)
     ON CONFLICT(id) DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at;`,
    [reservation.id, JSON.stringify(payload), createdAt, now]
  );
  return payload;
}

async function getSummary() {
  const result = await getPool().query(`
    SELECT
      (SELECT COUNT(*)::int FROM events) AS "eventCount",
      (SELECT COUNT(*)::int FROM registrations) AS "registrationCount",
      (SELECT COUNT(*)::int FROM reservations) AS "reservationCount";
  `);

  return {
    storage: "postgres",
    database: "DATABASE_URL",
    eventCount: result.rows[0]?.eventCount || 0,
    registrationCount: result.rows[0]?.registrationCount || 0,
    reservationCount: result.rows[0]?.reservationCount || 0,
  };
}

module.exports = {
  DB_FILE: "DATABASE_URL",
  getEventById,
  getEvents,
  getRegistrations,
  getReservations,
  getSummary,
  initDatabase,
  insertRegistration,
  insertReservation,
  upsertEvent,
};
