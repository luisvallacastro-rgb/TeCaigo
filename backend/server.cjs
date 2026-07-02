const http = require("node:http");
const { loadEnvFile } = require("./env.cjs");

loadEnvFile();

const {
  DB_FILE,
  getEventById,
  getEvents,
  getRegistrations,
  getReservations,
  getSummary,
  initDatabase,
  insertRegistration,
  insertReservation,
  upsertEvent,
} = require("./database.cjs");

const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || "sqlite";
const DEFAULT_ALLOWED_ORIGINS = [
  "https://tecaigo-app.onrender.com",
  "https://tecaigo-flutter-prototype.onrender.com",
  "https://webtecaigo-landing.onrender.com",
  "http://localhost:8084",
  "http://127.0.0.1:8084",
  "http://localhost:8091",
  "http://127.0.0.1:8091",
];

function getCorsOrigin(request) {
  if (CORS_ORIGIN === "*") return "*";

  const requestOrigin = request.headers.origin;
  const allowedOrigins = [
    ...CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
    ...DEFAULT_ALLOWED_ORIGINS,
  ];

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] || "*";
}

function sendJson(request, response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": getCorsOrigin(request),
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("El cuerpo de la solicitud es demasiado grande."));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function normalizeEvent(input) {
  const now = Date.now();
  const title = String(input.title || "Nuevo evento").trim();
  const id = String(input.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `evento-${now}`);

  return {
    id,
    title,
    description: input.description || "Evento creado desde la primera prueba de backend.",
    state: input.state || "Borrador",
    capacity: Number(input.capacity) || 0,
    visibility: input.visibility || "Privado del cluster",
    route: input.route || "",
    mode: input.mode || input.visibility || "Privado del cluster",
    cluster: input.cluster || "",
    host: input.host || "",
    price: Number(input.price) || 0,
    costs: {
      total: Number(input.costs?.total) || 0,
      guide: Number(input.costs?.guide) || 0,
      transport: Number(input.costs?.transport) || 0,
      other: Number(input.costs?.other) || 0,
    },
    commissions: {
      internal: input.commissions?.internal || "0%",
      external: input.commissions?.external || "0%",
    },
    image: input.image || "",
    photoTitle: input.photoTitle || "Sin imagen del evento",
    itinerary: input.itinerary || "",
    dates: Array.isArray(input.dates) ? input.dates : [],
  };
}

function normalizeRegistration(input) {
  const now = new Date().toISOString();
  const companyName = String(input.companyName || "Empresa sin nombre").trim();
  const idBase = companyName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: input.id || `${idBase || "registro"}-${Date.now()}`,
    companyName,
    legalRepresentative: input.legalRepresentative || "",
    phone: input.phone || "",
    email: input.email || "",
    address: input.address || "",
    dui: input.dui || "",
    nit: input.nit || "",
    userType: input.userType || "operador",
    bank: input.bank || "",
    bankAccount: input.bankAccount || "",
    accountHolder: input.accountHolder || "",
    observations: input.observations || "",
    clusterName: input.clusterName || "",
    linkedOperators: Array.isArray(input.linkedOperators) ? input.linkedOperators : [],
    status: input.status || "pendiente_validacion",
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
}

function normalizeReservation(input) {
  const now = new Date().toISOString();
  const eventTitle = String(input.eventTitle || input.event?.title || "Evento TeCaiGO").trim();
  const contact = String(input.contact || "Turista TeCaiGO").trim();
  const idBase = `${eventTitle}-${contact}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: input.id || `${idBase || "reserva"}-${Date.now()}`,
    source: input.source || "tecaigo-app",
    mode: input.mode || input.status || "Reserva",
    status: input.status || "Pendiente",
    eventId: input.eventId || "",
    eventTitle,
    eventLocation: input.eventLocation || input.event?.location || "",
    selectedDate: input.selectedDate || "",
    guests: Number(input.guests) || 1,
    contact,
    note: input.note || "",
    unitPrice: Number(input.unitPrice) || 0,
    total: Number(input.total) || 0,
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    sendJson(request, response, 204, {});
    return;
  }

  try {
    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(request, response, 200, {
        ok: true,
        service: "TeCaiGO Backend",
        message: "Backend conectado correctamente.",
        environment: process.env.NODE_ENV || "development",
        storage: DATABASE_PROVIDER,
        database: DB_FILE,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/summary") {
      sendJson(request, response, 200, await getSummary());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/events") {
      sendJson(request, response, 200, { events: await getEvents() });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/events/")) {
      const eventId = decodeURIComponent(url.pathname.replace("/api/events/", ""));
      const event = await getEventById(eventId);
      sendJson(request, response, event ? 200 : 404, event ? { event } : { error: "Evento no encontrado." });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/events") {
      const body = await readRequestBody(request);
      const input = body ? JSON.parse(body) : {};
      const newEvent = normalizeEvent(input);
      sendJson(request, response, 201, { event: await upsertEvent(newEvent) });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/registrations") {
      sendJson(request, response, 200, { registrations: await getRegistrations() });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/registrations") {
      const body = await readRequestBody(request);
      const input = body ? JSON.parse(body) : {};
      const registration = normalizeRegistration(input);
      sendJson(request, response, 201, { registration: await insertRegistration(registration) });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/reservations") {
      sendJson(request, response, 200, { reservations: await getReservations() });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/reservations") {
      const body = await readRequestBody(request);
      const input = body ? JSON.parse(body) : {};
      const reservation = normalizeReservation(input);
      sendJson(request, response, 201, { reservation: await insertReservation(reservation) });
      return;
    }

    sendJson(request, response, 404, { error: "Ruta no encontrada." });
  } catch (error) {
    sendJson(request, response, 500, { error: error.message || "Error interno del backend." });
  }
});

initDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`TeCaiGO backend listo en http://localhost:${PORT}`);
      console.log(`Base SQLite: ${DB_FILE}`);
      console.log(`Salud: http://localhost:${PORT}/api/health`);
      console.log(`Eventos: http://localhost:${PORT}/api/events`);
    });
  })
  .catch((error) => {
    console.error("No se pudo iniciar la base de datos:", error);
    process.exit(1);
  });
