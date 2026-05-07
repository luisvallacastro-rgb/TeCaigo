# Backend TeCaiGO

Primera prueba de backend para conectar el prototipo con una API real.

Para preparar produccion revisa tambien:

- `backend/.env.example`
- `backend/sql/postgres-schema.sql`
- `backend/PRODUCCION.md`

## Como arrancarlo

Desde la carpeta del prototipo:

```bash
node backend/server.cjs
```

Si el backend se despliega desde la carpeta `backend`, el comando de produccion sera:

```bash
node server.cjs
```

Luego abre:

- `http://localhost:3001/api/health`
- `http://localhost:3001/api/events`

## Rutas disponibles

- `GET /api/health`: confirma que el backend esta vivo.
- `GET /api/summary`: muestra conteos generales y confirma que se usa SQLite.
- `GET /api/events`: lista los eventos.
- `GET /api/events/:id`: obtiene un evento por id.
- `POST /api/events`: crea o reemplaza un evento.
- `GET /api/registrations`: lista registros de empresas/usuarios.
- `POST /api/registrations`: guarda una solicitud de registro.

Los datos ya se guardan en una base SQLite local:

```text
backend/data/tecaigo.sqlite
```

Los archivos `events.json` y `registrations.json` quedan como semillas iniciales para cargar datos de prueba cuando la base esta vacia. Despues cambiaremos SQLite por PostgreSQL + Prisma.

## Motores de base de datos

El backend ya puede escoger motor por variable de entorno:

```text
DATABASE_PROVIDER=sqlite
```

usa `backend/data/tecaigo.sqlite`.

```text
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://...
```

usa PostgreSQL administrado. En ese modo la dependencia `pg` viene declarada en `package.json` para que el proveedor de despliegue la instale.

Para pruebas con Neon, copia `backend/.env.neon.example` como `backend/.env` y pega la cadena completa en `DATABASE_URL`. El archivo `backend/.env` esta ignorado por Git para no subir secretos.
