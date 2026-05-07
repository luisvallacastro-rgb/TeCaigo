# Despliegue de TeCaiGO

Esta guia separa el sistema en dos partes:

- Frontend: lo que el usuario ve.
- Backend: API y base de datos.

## 1. Base de datos

Crear PostgreSQL administrado en Supabase o Neon.

Luego ejecutar el SQL:

```text
backend/sql/postgres-schema.sql
```

Guardar la `DATABASE_URL`.

## 2. Backend

Desplegar la carpeta:

```text
backend
```

Comando de instalacion:

```bash
npm install
```

Comando de arranque:

```bash
npm start
```

Variables de entorno:

```text
NODE_ENV=production
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://app.tecaigo.com
SESSION_SECRET=valor_largo_privado
```

Cuando este arriba, probar:

```text
https://URL-DEL-BACKEND/api/health
https://URL-DEL-BACKEND/api/summary
```

Si usas Render, ya existe un archivo base:

```text
render.yaml
```

Ese archivo declara el servicio backend y deja pendientes las variables secretas.

## 3. Frontend

El frontend es estatico: `index.html`, `styles.css`, `app.js`, `config.js` y `assets`.

Antes de subirlo, editar:

```text
config.js
```

Cambiar:

```js
API_BASE_URL: "http://localhost:3001/api"
```

por:

```js
API_BASE_URL: "https://URL-DEL-BACKEND/api"
```

## 4. Prueba de salida

Abrir el frontend y validar:

- El indicador superior muestra backend conectado.
- `Admin > Registro` guarda y actualiza la tabla.
- `Mis eventos` lee datos desde backend.
- `Crear evento > Guardar` manda el evento al backend.

## 5. Aun no abrir a usuarios finales sin esto

- Login y permisos.
- HTTPS.
- Backups de PostgreSQL.
- Almacenamiento de comprobantes bancarios.
- Politica de privacidad y manejo de documentos.
