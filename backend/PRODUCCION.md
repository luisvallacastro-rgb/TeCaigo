# Ruta a produccion de TeCaiGO

Este documento deja claro que falta para pasar del prototipo conectado a una base real.

## Decision tecnica

Para produccion usaremos:

- Backend: Node.js
- Base de datos: PostgreSQL administrado
- Desarrollo local temporal: SQLite
- Datos actuales conectados: eventos y registros

SQLite nos sirve para avanzar sin instalar nada. PostgreSQL sera la base real cuando el sistema salga a usuarios.

## Servicios recomendados

Opciones simples para no administrar servidores:

- Supabase: PostgreSQL administrado con panel visual.
- Neon: PostgreSQL administrado muy facil de conectar.
- Render/Railway: backend Node + PostgreSQL.

Mi recomendacion para iniciar: **Supabase o Neon para la base**, y despues Render/Railway para el backend.

Este proyecto incluye `render.yaml` como receta base para desplegar el backend en Render.

## Pasos cuando tengas la base PostgreSQL

1. Crear proyecto PostgreSQL en el proveedor elegido.
2. Copiar la `DATABASE_URL`.
3. Abrir el editor SQL del proveedor.
4. Pegar y ejecutar:

```text
backend/sql/postgres-schema.sql
```

En Neon, esto se hace en:

```text
SQL Editor > New Query > pegar SQL > Run
```

5. Configurar variables de entorno del backend:

```text
NODE_ENV=production
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://tu-dominio.com
SESSION_SECRET=un_valor_largo_y_privado
```

6. El backend cambiara automaticamente a PostgreSQL si `DATABASE_PROVIDER=postgres`.
7. Probar:

```text
/api/health
/api/summary
/api/events
/api/registrations
```

## Advertencia de seguridad

Si pegaste la `DATABASE_URL` completa en un chat o documento visible, regenera la contraseña en Neon antes de produccion real. La `DATABASE_URL` es una llave privada de la base de datos.

## Comandos esperados en el servidor

Si la plataforma despliega desde la carpeta `backend`:

```bash
npm install
npm start
```

Si despliega desde la raiz del proyecto, configurar como directorio de backend:

```text
backend
```

## Pendientes antes de usuarios reales

- Autenticacion de usuarios.
- Roles: administrador, anfitrion, operador, comercio y transporte.
- Validacion de documentos.
- Carga segura de comprobantes bancarios.
- Backups automaticos de la base.
- Logs de auditoria.
- Dominio y certificado HTTPS.
- Politica de permisos para ver/editar eventos.

## Que significa "listo para produccion"

No basta con que funcione en localhost. Para decir que esta en produccion debe tener:

- Base PostgreSQL fuera de la computadora local.
- Backend desplegado en un servidor.
- Frontend apuntando al backend real.
- Variables secretas fuera del codigo.
- Respaldo automatico.
- Login y permisos.
- Pruebas basicas de guardar/leer eventos y registros.
