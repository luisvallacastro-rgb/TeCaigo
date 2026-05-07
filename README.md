# TeCaiGO

Prototipo funcional del sistema TeCaiGO para gestion turistica conectada.

## Estado actual

- Frontend prototipo en HTML, CSS y JavaScript.
- Backend Node.js con API REST.
- Base local SQLite para desarrollo.
- Base PostgreSQL/Neon preparada para produccion.
- Configuracion base para despliegue en Render.

## Backend

La carpeta `backend` contiene el servidor API.

Comandos principales:

```bash
cd backend
npm install
npm start
```

Rutas principales:

```text
GET /api/health
GET /api/summary
GET /api/events
POST /api/events
GET /api/registrations
POST /api/registrations
```

## Produccion

Para produccion usar:

```text
DATABASE_PROVIDER=postgres
DATABASE_URL=<cadena privada de Neon>
```

La guia de despliegue esta en:

```text
GUIA_RENDER_PASO_A_PASO.md
backend/PRODUCCION.md
```

## Seguridad

No subir archivos `.env`, bases SQLite locales ni `node_modules`.
