# TeCaiGO: siguiente paso para produccion

Esta guia es para conectar el backend de TeCaiGO a Neon usando Render.

## Que ya hicimos

- La base de datos Neon ya fue creada.
- Las tablas principales ya existen.
- El backend ya sabe trabajar con PostgreSQL/Neon.
- El prototipo local sigue funcionando con SQLite mientras no este publicado.

## Por que no lo probamos directo en esta Mac

Para conectar Node.js con Neon hace falta una libreria llamada `pg`.
Esta Mac no tiene `npm`, que es el instalador de librerias de Node.

Render si tiene `npm`, por eso ahi se instala automaticamente y es el camino mas limpio para produccion.

## Paso 1: subir el proyecto a GitHub

Render normalmente toma el codigo desde GitHub.

Necesitamos un repositorio con el contenido del proyecto `tecaigo-prototipo`.

No subir estos archivos:

- `backend/.env`
- `backend/data/tecaigo.sqlite`
- `node_modules`

El proyecto ya tiene `.gitignore` para ayudar con eso.

## Paso 2: crear Web Service en Render

En Render:

1. Crear cuenta o iniciar sesion.
2. Elegir `New`.
3. Elegir `Web Service`.
4. Conectar GitHub.
5. Seleccionar el repositorio de TeCaiGO.
6. Usar esta configuracion:

```text
Name: tecaigo-backend
Environment: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

## Paso 3: variables secretas en Render

En la seccion `Environment`, agregar:

```text
NODE_ENV=production
DATABASE_PROVIDER=postgres
DATABASE_URL=la_cadena_de_neon
CORS_ORIGIN=http://localhost:8084
SESSION_SECRET=un_texto_largo_privado
```

Importante: `DATABASE_URL` no debe quedar escrita dentro del codigo.

## Paso 4: probar backend publicado

Cuando Render termine el despliegue, dara una direccion parecida a:

```text
https://tecaigo-backend.onrender.com
```

Probar estas rutas:

```text
https://tecaigo-backend.onrender.com/api/health
https://tecaigo-backend.onrender.com/api/summary
https://tecaigo-backend.onrender.com/api/events
```

Si `/api/summary` muestra `storage: postgres`, ya estamos conectados a Neon.

## Paso 5: conectar el frontend

Cuando tengamos la URL real del backend, cambiar en `config.js`:

```js
window.TECAIGO_CONFIG = {
  API_BASE_URL: "https://tecaigo-backend.onrender.com/api",
};
```

Despues el prototipo visual ya leera y guardara contra el backend publicado.

## Nota importante de seguridad

Si la cadena de Neon fue pegada en algun chat, documento o captura, antes de poner usuarios reales conviene regenerar la contraseña en Neon.
Esa cadena funciona como llave de acceso a la base.
