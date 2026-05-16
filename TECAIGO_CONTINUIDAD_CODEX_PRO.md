# TeCaiGO - Documento de continuidad para otra cuenta de Codex Pro

Fecha de preparacion: 2026-05-14  
Proyecto: TeCaiGO  
Usuario lider: Luis Valladares  
Idioma de trabajo: Espanol

## 1. Proposito de este documento

Este documento sirve para que otra cuenta de Codex Pro pueda retomar el proyecto TeCaiGO sin perder contexto.

Debe leerse antes de tocar codigo. El objetivo es que el nuevo Codex entienda:

- Que problema resuelve TeCaiGO.
- Que ya existe en frontend, backend, base de datos y despliegue.
- Que estilo visual se esta construyendo.
- Que decisiones de experiencia de usuario ya fueron tomadas.
- Que partes siguen siendo prototipo y que partes ya estan conectadas a produccion.
- Como continuar sin romper lo publicado.

## 2. Resumen del producto

TeCaiGO es un sistema de interconexion turistica.

La idea central es conectar:

- Anfitriones de cluster.
- Tour operadores internos.
- Tour operadores externos.
- Comercios turisticos.
- Rutas, eventos, cupos, solicitudes y liquidaciones.

El sistema permite crear eventos turisticos, controlar cupos, abrir eventos al mercado publico cuando un cluster necesita ayuda para llenar una salida, registrar pagos, validar comprobantes, revisar composicion de cupos por operador y visualizar el movimiento general del cluster.

El usuario no es programador, por lo que cada explicacion debe ser clara, paso a paso y sin asumir conocimiento tecnico.

## 3. Ubicacion del proyecto local

Carpeta raiz compartida:

```text
/Users/luisvalladares/Documents/Codex/2026-05-01/files-mentioned-by-the-user-codex
```

Carpeta principal del proyecto:

```text
/Users/luisvalladares/Documents/Codex/2026-05-01/files-mentioned-by-the-user-codex/Codex/2026-04-29/necesito-que-me-ayudes-a-desarrollar/tecaigo-prototipo
```

Archivos principales:

```text
index.html
styles.css
app.js
config.js
assets/
backend/
```

## 4. Estado tecnico general

El proyecto tiene dos capas:

1. Frontend prototipo:
   - HTML, CSS y JavaScript plano.
   - No usa React ni framework de frontend.
   - La mayor parte de la experiencia visual esta en `styles.css`.
   - La interaccion simulada y datos de prototipo estan en `app.js`.

2. Backend inicial:
   - Node.js con API REST.
   - Base local SQLite para desarrollo.
   - PostgreSQL/Neon preparado para produccion.
   - Render usado para publicar backend y frontend.

## 5. Estado de produccion

Ya existe publicacion en Render:

```text
Backend:
https://tecaigo.onrender.com

Frontend:
https://tecaigo-app.onrender.com
```

Repositorio GitHub:

```text
https://github.com/luisvallacastro-rgb/TeCaigo.git
```

Base de datos:

```text
Neon PostgreSQL
```

Importante:

- No escribir ni repetir cadenas privadas de Neon en respuestas.
- No subir `.env`.
- No pegar tokens privados en documentos.
- Si se necesita configurar Render, pedir al usuario que coloque las variables en Render, sin pedir que las exponga en chat.

## 6. Produccion vs desarrollo local

El usuario quiere seguir mejorando el frontend localmente sin afectar produccion.

Recomendacion de trabajo:

- Hacer cambios en local.
- Verificar visualmente.
- Cuando el usuario diga que ese es el corte final, hacer commit y push a GitHub.
- Render se actualiza desde GitHub.
- No publicar automaticamente cada cambio visual experimental.

## 7. Archivos de documentacion existentes

Dentro del proyecto hay documentos utiles:

```text
README.md
DESPLIEGUE.md
GUIA_RENDER_PASO_A_PASO.md
CONTEXTO_PROTOTIPO.md
backend/README.md
backend/PRODUCCION.md
backend/sql/postgres-schema.sql
```

Este documento complementa esos archivos con la historia mas reciente del prototipo.

## 8. Comandos utiles

Entrar al proyecto:

```bash
cd "/Users/luisvalladares/Documents/Codex/2026-05-01/files-mentioned-by-the-user-codex/Codex/2026-04-29/necesito-que-me-ayudes-a-desarrollar/tecaigo-prototipo"
```

Revisar cambios:

```bash
git status --short
git diff --stat
```

Validar JavaScript:

```bash
node --check app.js
```

Validar espacios o errores de diff:

```bash
git diff --check
```

Levantar frontend local como archivo:

```text
Abrir index.html en navegador
```

Levantar servidor local estatico si hace falta:

```bash
python3 -m http.server 8084
```

URL local:

```text
http://localhost:8084/
```

Backend local:

```bash
cd backend
npm install
npm start
```

Rutas backend:

```text
GET /api/health
GET /api/summary
GET /api/events
POST /api/events
GET /api/registrations
POST /api/registrations
```

## 9. Estado actual de Git

Al preparar este documento habia cambios locales en:

```text
app.js
index.html
styles.css
```

No asumir que esos cambios ya estan publicados. Revisar `git status --short`.

## 10. Estilo visual actual buscado

El usuario esta guiando el frontend hacia un estilo:

- Dark glass.
- Vidrio transparente.
- Elementos flotantes.
- Sin contornos pesados.
- Sin tarjetas blancas cuando no aportan valor.
- Sin bloques alternados por columna en las tablas.
- Tipografia limpia, grande, con buena lectura.
- Hover muy suave.
- Animaciones elegantes, no exageradas.
- Paleta TeCaiGO: fondo oscuro, teal, cyan suave, blanco, gris claro.
- Evitar morado como color dominante.
- Evitar tablas tradicionales demasiado rigidas.

Paleta aproximada:

```text
Fondo principal: #061116 / #07141b / #0b1118
Teal fuerte: #00757a / #08777d
Cyan suave: #8ff3f4
Texto principal: #ffffff / #f6f8f8
Texto secundario: rgba(255,255,255,0.65)
Vidrio: rgba(255,255,255,0.04) a rgba(255,255,255,0.10)
```

Regla visual importante:

No hacer que todo parezca encerrado en cuadros. El usuario prefiere que las cosas floten dentro del sistema.

## 11. Modulos principales del sistema

Menu actual:

- Home
- Crear evento
- Mis eventos
- Eventos publicos
- Solicitudes
- Finanzas
- Clusters
- Admin

En movil, el menu no debe quedar fijo encima de la experiencia. Debe ocultarse y poder mostrarse con una accion clara.

## 12. Home / HomeFeed

Objetivo:

Ser una experiencia tipo feed turistico.

Elementos:

- Barra de categorias con circulos:
  - Todos
  - Playa
  - Montana
  - Pueblos
  - Caminatas
  - Lagos
  - Gastro

Interaccion:

- Los circulos tienen animacion tipo Dock de Mac.
- Al pasar el mouse, el circulo aumenta con suavidad.
- Deben flotar, sin barra visible pesada.
- No debe cortarse el circulo al hacer hover.
- No debe quedar demasiado espacio vertical desperdiciado arriba.

Publicaciones:

- El usuario pidio que el CRUD de publicaciones funcione.
- Debe permitir agregar imagenes.
- Debe permitir guardar la publicacion.
- Debe visualizarse en el HomeFeed.
- Botones como Foto, Tag, Smile, Lugar, GIF y mas deben estar habilitados visualmente o simular comportamiento.
- Me interesa, Comentar, Compartir y Eliminar deben tener sentido funcional dentro del prototipo.

Ultima preferencia visual:

- Las publicaciones tambien deben sentirse como vidrio flotante.
- La barra de publicacion no debe quedar por encima del feed al hacer scroll.
- El contenido debe leerse bien, sin barras blancas duras.

## 13. Crear evento

Este modulo ha cambiado mucho.

Actualmente debe centrarse en eventos internos del cluster.

El usuario pidio:

- Sacar la matriz de solicitudes externas de Crear evento.
- Dejar solo el conteo separado.
- Colocar el menu de Solicitudes debajo de Crear evento en el menu lateral.
- Eliminar tarjetas superiores sin sentido como "modo prototipo sin backend / LV / Crear evento" dentro del modulo.
- El encabezado debe ser compacto: solo titulo `Cluster Premier` y un simbolo `+` pequeno y discreto.
- El simbolo `+` representa crear un nuevo evento desde cero.

Matriz interna:

- Debe tener estilo vidrio.
- Sin bordes duros.
- Sin cortes por columnas.
- Una fila debe sentirse como una sola pieza, no como bloques separados.
- Hover muy suave.
- Debe verse panoramica aun con menu lateral abierto.
- Reducir espacio excesivo entre columnas para que los botones de accion no se compriman.

Regla funcional:

- El boton `+` grande del encabezado de la matriz interna crea evento nuevo desde cero.
- En el detalle de evento, el boton que antes decia "Nuevo" debe llamarse `Nueva fecha`.
- `Nueva fecha` no crea un evento vacio, sino que hereda datos del evento actual y permite replicarlo en otra fecha.

## 14. Datos actuales para pruebas de Crear evento

El usuario pidio resetear los datos para probar interfaces:

- Tres eventos el dia 25/05/2026.
- Dos eventos el dia 20/05/2026.
- Cada evento debe ser editable.
- Cada evento debe tener imagenes, conteo y detalle.

Ejemplos usados:

- Ruta las flores
- Ruta panoramica
- Cafe y senderos
- Ruta al volcan
- Tour cafe y mirador

## 15. Cluster Premier / selector por fecha

El usuario no quiere filtros tradicionales en esta vista.

Debe mostrarse:

- Titulo: `Cluster Premier`
- Debajo, un selector tipo slider por fecha.
- La fecha activa se muestra como informacion, no como boton de filtro clasico.
- Debe iniciar con la fecha mas reciente que tenga eventos.
- Debe mostrar solo los eventos de esa fecha.
- Navegacion:
  - Flecha izquierda: fecha anterior disponible con eventos.
  - Flecha derecha: fecha siguiente disponible con eventos.
- No quiere scroll infinito de fechas.
- Quiere pasar entre una carta y otra dependiendo de la fecha.

Detalle importante:

- Bajo `Cluster Premier` no debe mostrarse otra linea quemada con fecha y conteo. Solo el nombre del cluster.

## 16. Composicion de cupos

Antes existia como tarjeta fija lateral. El usuario pidio quitarla de la vista principal.

Nuevo comportamiento:

- La lista de eventos queda apilada.
- Al hacer click en un evento, se levanta la composicion de cupos como emergente a la par.
- Debe verse sobre un efecto de vidrio borroso.
- Debe poder cerrarse haciendo click en una zona muerta o contorno fuera de la vista.

Informacion de composicion:

- Nombre del evento.
- Conteo general vendido/capacidad.
- Cupos disponibles.
- Integrantes y aportes:
  - Luis Valladares
  - Cipitio Tour
  - Turismo Tour
  - Aventura Local
  - Ruta Viva

## 17. Mis eventos

Objetivo:

Agenda global del anfitrion.

Se trabajo:

- Matriz por fecha.
- Calendario operativo.
- Selector de semanas lunes a domingo.
- Correccion de rangos de semana.
- Detalle de cluster por evento seleccionado.
- Columna Score eliminada.
- Boton de accion con icono de papel para imprimir reporte PDF.

Estado deseado:

- La vista debe ser mas limpia, especialmente en movil.
- Evitar columnas largas en celular.
- En movil, convertir tablas a tarjetas entendibles.
- No dejar menu lateral cubriendo contenido.

## 18. Reporte imprimible del evento

Se pidio trabajar un reporte PDF/imprimible.

Requisitos:

- Titulo:

```text
Detalle de evento: [nombre del evento]
```

- Usar logo blanco del proyecto para reporteria.
- Logo disponible:

```text
assets/tecaigo-blanco.png
```

- Primera parte:
  - Generalidades del evento.
  - Informacion en formato tabla:
    - Nombre
    - Cluster
    - Cupos vendidos
    - Fecha de salida
    - Estado
    - Visibilidad
    - Precio por cupo
    - Costos
    - Margen
    - Otros datos relevantes.

El usuario no quiere reporte visual pobre ni basico; debe verse profesional.

## 19. Eventos publicos

Objetivo:

Mostrar eventos que anfitriones colocan publicos para recibir ayuda de otros operadores.

Regla de negocio:

Un anfitrion puede tener un evento privado con su cluster. Si faltan pocos dias y el riesgo de no llenar cupos es alto, puede activar el switch `Publico` desde el detalle del evento. Al hacerlo, el evento se replica visualmente en el modulo de Eventos publicos para que otros operadores soliciten cupos.

Detalle:

- El switch debe decir `Privado` cuando esta apagado.
- Al encenderlo, pasa a `Publico`.
- El texto debe explicar que se replica en Eventos publicos para recibir ayuda de otros operadores.

## 20. Solicitudes

Antes algunas solicitudes externas estaban dentro de Crear evento.

Decision actual:

- Crear evento no debe tener la matriz de solicitudes externas.
- Solicitudes debe vivir como modulo propio del menu.
- En el menu lateral, Solicitudes debe estar debajo de Crear evento.

Solicitudes maneja:

- Eventos externos.
- Cupos solicitados.
- Estado:
  - Pendiente
  - Aprobado
  - Pagado
  - Cerrado
- Acciones por fila.
- En eventos cerrados pagados, evitar repetir etiquetas de `Pagado`.
- Boton para enviar boleta / comprobante bancario.

## 21. Boletas y comprobantes bancarios

Modal:

```text
Enviar boleta de pago
```

Campos:

- Numero de boleta bancaria.
- Fecha de pago.
- Banco.
- Monto.
- Adjuntar comprobante de pago.

Debe aceptar comprobante para:

- Internos.
- Externos.

Los archivos reales todavia requieren almacenamiento productivo futuro.

## 22. Admin

El modulo Admin fue depurado.

Antes tenia metricas y revision operativa. El usuario pidio borrar eso y dejar opciones de administracion.

Por ahora solo debe existir:

```text
Registro
```

No mostrar:

- Validacion
- Roles y accesos
- Catalogos
- Comisiones

Mientras no esten desarrollados, no deben aparecer.

## 23. Registro de usuarios y empresas

Formulario:

- Nombre de empresa comercial.
- Representante legal.
- Telefono.
- Correo electronico.
- Direccion.
- Numero de DUI.
- Numero de NIT.
- Tipo de usuario.
- Banco para liquidaciones.
- Numero de cuenta bancaria.
- Nombre del titular de cuenta.
- Observaciones administrativas.

Tipos de usuario:

- Anfitrion de cluster.
- Tour operador.
- Comercio turistico.
- Transporte.

Si el tipo es `Anfitrion de cluster`, debe aparecer seccion de vinculacion.

## 24. Vinculacion de cuentas / cluster anfitrion

Cuando el usuario es Anfitrion de cluster:

Debe llenar:

- Nombre del Cluster.
- Tour operador disponible.
- Boton `+` para agregar.
- Chips/lista de operadores vinculados.

Reglas:

- Solo se pueden agregar tour operadores vigentes que no pertenezcan a otro cluster.
- Cuando un operador se agrega, desaparece de la lista desplegable.
- Cada chip debe tener boton para eliminarlo.
- Si se elimina un operador, debe volver a estar disponible en la lista.
- No debe permitir agregar repetidamente el ultimo operador.

Bug ya identificado y corregido previamente:

- El ultimo operador seguia disponible y se podia agregar muchas veces. Revisar que no vuelva a pasar.

## 25. Detalle de evento

Cada evento debe abrir su propio detalle, no un detalle generico compartido.

Requisitos:

- La accion de ver evento debe abrir informacion propia de esa fila.
- El detalle debe ser individual por evento.
- Debe incluir CRUD visual.
- Boton `Editar`.
- Boton `Guardar`.
- Boton `Nueva fecha`.
- Boton `+` para nuevo evento desde cero en el area correspondiente.

El detalle tambien tiene una tarjeta flotante tipo ventana:

- Minimizar.
- Agrandar/restaurar.
- Cerrar.
- Al minimizar, debe permanecer visible en cualquier modulo.
- Debe poder moverse arrastrandola con el mouse.
- Cuando esta minimizada, no debe tapar demasiado ni deformarse.

## 26. Finanzas

Todavia no es el foco actual.

Debe considerar:

- Pagos.
- Liquidaciones.
- Comisiones internas.
- Comisiones externas.
- Recibos bancarios.
- Validacion de comprobantes.

## 27. Backend actual

Carpeta:

```text
backend/
```

Tecnologias:

- Node.js.
- API REST.
- SQLite local.
- PostgreSQL/Neon en produccion.

Archivos relevantes:

```text
backend/server.cjs
backend/db.cjs
backend/db-postgres.cjs
backend/database.cjs
backend/env.cjs
backend/sql/postgres-schema.sql
backend/data/events.json
backend/data/registrations.json
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

Estado productivo:

- Render backend ya esta vivo.
- Neon ya tiene tablas.
- Render tiene variables de entorno.
- El frontend puede conectarse al backend.

Limitaciones actuales:

- No hay login real.
- No hay permisos por rol.
- No hay almacenamiento real de imagenes/comprobantes.
- No hay auditoria funcional completa.
- No todo el frontend esta conectado al backend; muchas partes siguen simuladas.

## 28. Variables de entorno esperadas en Render

No escribir valores secretos aqui.

Variables:

```text
NODE_ENV=production
DATABASE_PROVIDER=postgres
DATABASE_URL=<cadena privada de Neon>
CORS_ORIGIN=<origenes permitidos separados por coma si aplica>
SESSION_SECRET=<secreto largo privado>
```

Nota:

Si se ve un texto en frontend como `Backend SQLite`, revisar:

- Si `DATABASE_PROVIDER` esta en `postgres`.
- Si `DATABASE_URL` esta correctamente colocada.
- Si Render redeployo despues de guardar variables.
- Si el frontend apunta al backend correcto.

## 29. Como publicar cambios cuando Luis lo apruebe

Desde la carpeta del proyecto:

```bash
git status --short
git add index.html styles.css app.js config.js assets backend README.md DESPLIEGUE.md GUIA_RENDER_PASO_A_PASO.md CONTEXTO_PROTOTIPO.md
git commit -m "Actualizar experiencia frontend TeCaiGO"
git push origin main
```

Render deberia hacer deploy automatico.

Antes de publicar:

```bash
node --check app.js
git diff --check
```

## 30. Forma de trabajar con Luis

Luis esta construyendo el producto visualmente y por flujo.

Forma ideal de responder:

- En espanol.
- Claro.
- Sin tecnicismos innecesarios.
- Explicar que se esta haciendo en frases cortas.
- Hacer cambios directamente si la peticion es clara.
- No pedir confirmaciones de mas.
- Cuando haya riesgos de produccion, explicar antes de publicar.
- Evitar respuestas largas si solo pide un ajuste pequeno.

Luis valora:

- Que se le explique como si no fuera programador.
- Que se le diga si algo ya esta en produccion o solo local.
- Que el sistema se vea premium.
- Que se mejore la experiencia movil.
- Que no se rompa lo que ya funciona.

## 31. Estilo de codigo

Reglas:

- Usar `apply_patch` para editar archivos manualmente.
- No usar comandos destructivos.
- No revertir cambios sin permiso.
- Validar JS con `node --check app.js`.
- Validar diff con `git diff --check`.
- Revisar con `rg` y `sed`.

## 32. Ultimos ajustes recientes conocidos

Se estaba trabajando en:

- Matriz de Crear evento estilo vidrio.
- Eliminar ranking lateral para ganar espacio panoramico.
- Hacer filas con un solo fondo, no cortes entre columnas.
- Reducir espacios entre columnas.
- Dar mas aire a botones de accion CRUD.
- Ajustar ancho minimo de la matriz para que no se vea comprimida con menu lateral.

Cambios recientes aplicados en `styles.css`:

- `#event-builder .event-matrix` bajo a ancho minimo mas contenido.
- Columnas de la matriz se hicieron mas compactas.
- Botones CRUD se dejaron en una sola linea.
- Botones de accion bajaron a tamano mas compacto.

Si se retoma aqui, revisar especialmente:

```css
#event-builder .event-matrix
#event-builder .event-matrix thead tr
#event-builder .event-matrix tbody tr
#event-builder .event-matrix .crud-actions
```

## 33. Pendientes probables

Estos son buenos siguientes pasos:

1. Terminar el refinamiento visual de la matriz interna de Crear evento.
2. Confirmar que con menu lateral abierto la tabla no comprime los botones.
3. Confirmar que sin menu lateral la tabla se ve panoramica y elegante.
4. Revisar vista movil completa.
5. Terminar CRUD visual de HomeFeed con imagenes.
6. Pulir reporte PDF del evento.
7. Conectar gradualmente formularios reales al backend.
8. Disenar login y permisos por rol.
9. Definir almacenamiento de imagenes y comprobantes.
10. Separar prototipo local de produccion estable con ramas o flujo de release.

## 34. Prompt recomendado para abrir otra sesion de Codex Pro

Copiar y pegar esto en la nueva cuenta de Codex Pro:

```text
Estamos trabajando en TeCaiGO, un sistema de interconexion turistica para anfitriones de cluster, tour operadores, eventos, cupos, solicitudes, pagos y publicaciones. Lee primero el archivo TECAIGO_CONTINUIDAD_CODEX_PRO.md dentro del proyecto.

Ruta local del proyecto:
/Users/luisvalladares/Documents/Codex/2026-05-01/files-mentioned-by-the-user-codex/Codex/2026-04-29/necesito-que-me-ayudes-a-desarrollar/tecaigo-prototipo

Quiero que trabajes en espanol y recuerdes que no soy programador. Explicame de forma simple, pero implementa los cambios directamente cuando sea claro.

No publiques a Render ni hagas push a GitHub salvo que yo lo pida explicitamente.

El estilo visual buscado es dark glass, transparente, flotante, minimalista, con paleta TeCaiGO teal/cyan/blanco, sin morado dominante, sin bordes pesados, sin tarjetas blancas innecesarias y con hover muy suave.

Antes de editar, revisa app.js, styles.css e index.html. Despues de editar, valida con:
node --check app.js
git diff --check
```

## 35. Nota final

Este proyecto ya no es solo una maqueta visual inicial. Tiene:

- Prototipo frontend avanzado.
- Backend base.
- Base de datos PostgreSQL en Neon.
- Publicacion en Render.
- Repositorio GitHub.

Pero todavia debe considerarse en fase de construccion. Lo recomendable es seguir perfeccionando el frontend localmente y publicar cortes estables cuando Luis los apruebe.
