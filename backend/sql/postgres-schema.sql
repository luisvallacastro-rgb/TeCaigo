-- TeCaiGO - esquema inicial de produccion PostgreSQL
-- Ejecutar este archivo en la base PostgreSQL administrada.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_payload_title_idx
  ON events ((payload ->> 'title'));

CREATE INDEX IF NOT EXISTS events_payload_state_idx
  ON events ((payload ->> 'state'));

CREATE INDEX IF NOT EXISTS events_payload_cluster_idx
  ON events ((payload ->> 'cluster'));

CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS registrations_company_idx
  ON registrations ((payload ->> 'companyName'));

CREATE INDEX IF NOT EXISTS registrations_user_type_idx
  ON registrations ((payload ->> 'userType'));

CREATE INDEX IF NOT EXISTS registrations_status_idx
  ON registrations ((payload ->> 'status'));

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reservations_event_idx
  ON reservations ((payload ->> 'eventTitle'));

CREATE INDEX IF NOT EXISTS reservations_source_idx
  ON reservations ((payload ->> 'source'));

CREATE INDEX IF NOT EXISTS reservations_status_idx
  ON reservations ((payload ->> 'status'));

-- Tablas que vienen despues de validar el flujo principal.
-- Las dejamos documentadas para que el sistema crezca ordenado.

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_entity_idx
  ON audit_log (entity_type, entity_id);

CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  operator_name TEXT,
  receipt_number TEXT,
  bank TEXT,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_date DATE,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente_validacion',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_receipts_event_idx
  ON payment_receipts (event_id);
