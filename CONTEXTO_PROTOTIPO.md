# TeCaigo - Contexto del prototipo

Este paquete contiene el prototipo frontend de TeCaigo trabajado hasta el 2026-05-03.

Archivos principales:
- `index.html`: estructura de pantallas y modales.
- `styles.css`: estilos visuales del prototipo.
- `app.js`: interacciones, filtros, matrices, modales y comportamiento simulado.

Estado actual del prototipo:
- Home/feed turistico.
- Crear evento con matriz interna y detalle dinamico por evento.
- Mis eventos con agenda global, calendario operativo, matriz de eventos y detalle de cluster.
- Eventos publicos con tarjetas de oferta y demanda.
- Solicitudes de cupos y validacion de remesas.
- Finanzas, clusters y admin como vistas de apoyo.

Cambios relevantes recientes:
- El detalle del evento ya no es unico: cada fila abre datos propios.
- El detalle incluye CRUD visual: nuevo evento, editar, guardar cambios.
- Nuevo evento abre la interfaz vacia, lista para cargar datos.
- Switch Privado/Publico: al activarlo muestra replica visual en Eventos publicos.
- El detalle puede minimizarse, agrandarse o cerrarse con controles tipo ventana.
- Al minimizar, la tarjeta queda flotante, movible con mouse y visible en cualquier modulo.
- Modal de boleta bancaria permite adjuntar comprobante de pago en imagen o PDF.

Como correrlo:
1. Abrir una terminal en esta carpeta.
2. Ejecutar: `python3 -m http.server 8084`
3. Abrir: `http://localhost:8084/`

Nota:
Este es un prototipo frontend sin base de datos. Los datos se simulan en `app.js` para validar experiencia, pantallas, flujos y reglas visuales antes de construir backend, base de datos y persistencia real.
