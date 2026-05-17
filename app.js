const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const composerModal = document.querySelector("#composerModal");
const composerTextarea = document.querySelector(".composer-textarea");
const composerFileInput = document.querySelector("[data-composer-file]");
const composerPreview = document.querySelector("[data-composer-preview]");
const publishPostButton = document.querySelector("[data-publish-post]");
const eventFormPanel = document.querySelector("#eventFormPanel");
const paymentModal = document.querySelector("#paymentModal");
const slotRequestModal = document.querySelector("#slotRequestModal");
const slotRequestForm = document.querySelector("[data-slot-request-form]");
const mobileMenuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenuOverlay = document.querySelector("[data-menu-overlay]");
const tasteCarousel = document.querySelector(".taste-carousel");
const desktopSidebarDeadZones = ".main, .view, .view.active, .home-layout, .feed-layout, .social-feed";
const API_BASE_URL = window.TECAIGO_CONFIG?.API_BASE_URL || "http://localhost:3001/api";
const LOCAL_FEED_POSTS_KEY = "tecaigo-local-feed-posts";
const EMPTY_EVENT_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
let minimizedDrag = null;
let composerImages = [];
const paramCalendarState = { month: new Date().getMonth(), year: new Date().getFullYear() };

const clusterCupComposition = {
  "ruta-flores": [
    { name: "Luis Valladares", count: 4, isMe: true },
    { name: "Cipitio Tour", count: 14 },
    { name: "Turismo Tour", count: 10 },
    { name: "Aventura Local", count: 9 },
    { name: "Ruta Viva", count: 7 },
  ],
  "ruta-volcan": [
    { name: "Luis Valladares", count: 6, isMe: true },
    { name: "Cipitio Tour", count: 8 },
    { name: "Turismo Tour", count: 4 },
    { name: "Aventura Local", count: 4 },
    { name: "Ruta Viva", count: 2 },
  ],
  "ruta-panoramica": [
    { name: "Luis Valladares", count: 12, isMe: true },
    { name: "Cipitio Tour", count: 11 },
    { name: "Turismo Tour", count: 8 },
    { name: "Aventura Local", count: 6 },
    { name: "Ruta Viva", count: 4 },
  ],
  "cafe-senderos": [
    { name: "Luis Valladares", count: 2, isMe: true },
    { name: "Cipitio Tour", count: 6 },
    { name: "Turismo Tour", count: 4 },
    { name: "Aventura Local", count: 4 },
    { name: "Ruta Viva", count: 2 },
  ],
  "tour-cafe": [
    { name: "Luis Valladares", count: 5, isMe: true },
    { name: "Cafe Aventura", count: 14 },
    { name: "Aventura Local", count: 8 },
    { name: "Ruta Viva", count: 5 },
    { name: "Cipitio Tour", count: 2 },
  ],
};

const feedEnhancements = [
  {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    image2:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    alt: "Mirador con paisaje verde",
    category: "gastronomia",
    tags: ["Vinculo: Comercio", "Potencial: evento gastronomico", "Capacidad sugerida: 35 personas"],
    comments: ["Ruta Viva: Podemos aportar 12 pasajeros si se programa domingo."],
    action: "Crear evento desde este lugar",
    jump: "event-builder",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=85",
    image2:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    alt: "Lago rodeado de montanas",
    category: "lagos",
    tags: ["Vinculo: Operador", "Demanda detectada: 18 interesados", "Requiere transporte: lancha + bus"],
    comments: ["Lago Hostal: Tenemos almuerzo para grupos de 40 personas."],
    action: "Proponer alianza",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    image2:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
    alt: "Lago y montanas panoramicas",
    category: "pueblos",
    tags: ["Vinculo: Comercio", "Potencial: paquete con hospedaje", "Capacidad sugerida: 45 personas"],
    comments: ["Rutas SV: Podemos asignar bus de 50 pasajeros para sabado y domingo."],
    action: "Crear evento desde este lugar",
    jump: "event-builder",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=85",
    image2:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=85",
    alt: "Camino panoramico de montana",
    category: "montana",
    tags: ["Vinculo: Evento futuro", "Ruta internacional", "Oferta y demanda", "Comision externa 70%"],
    comments: [],
    action: "Ver eventos publicos",
    jump: "public-events",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    image2:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=85",
    alt: "Playa panoramica",
    category: "playa",
    tags: ["Vinculo: Comercio", "Cluster: Surf City", "Capacidad sugerida: 30 personas"],
    comments: [],
    action: "Crear evento desde este lugar",
    jump: "event-builder",
  },
  {
    image:
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=85",
    image2:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=85",
    alt: "Bosque panoramico",
    category: "caminatas",
    tags: ["Vinculo: Operador", "Aporte estimado: 13 cupos", "Cluster: Ruta Panoramica"],
    comments: [],
    action: "Ver mis eventos",
    jump: "my-events",
  },
];

const dateSegments = {
  "2026-05": [
    { value: "todos", day: 0, label: "Todo el mes", title: "Todo el mes", range: "01/05/26 - 31/05/26", count: "5 / 5" },
    { value: "2026-w21", day: 20, label: "20 Mayo", title: "#21", range: "18/05/26 - 24/05/26", count: "2 / 2" },
    { value: "2026-w22", day: 25, label: "25 Mayo", title: "#22", range: "25/05/26 - 31/05/26", count: "3 / 3" },
  ],
  "2026-06": [
    { value: "todos", day: 0, label: "Todo el mes", title: "Todo el mes", range: "01/06/26 - 30/06/26", count: "1 / 1" },
    { value: "2026-w23", day: 2, label: "2 Junio", title: "#23", range: "01/06/26 - 07/06/26", count: "1 / 1" },
  ],
  "2027-05": [{ value: "todos", day: 0, label: "Sin programacion", title: "Sin datos", range: "Sin eventos", count: "0 / 0" }],
  "2027-06": [{ value: "todos", day: 0, label: "Sin programacion", title: "Sin datos", range: "Sin eventos", count: "0 / 0" }],
};

const clusterEventDetails = {
  "ruta-flores": {
    title: "Ruta las flores",
    rows: [
      { operator: "TeCaigo Tours", role: "Anfitrion", contributed: 20, paid: 18, total: 20 },
      { operator: "Aventura Local", role: "Operador", contributed: 10, paid: 8, total: 10 },
      { operator: "Ruta Viva", role: "Operador", contributed: 8, paid: 8, total: 8 },
      { operator: "Cipitio Tour", role: "Operador", contributed: 10, paid: 9, total: 10 },
    ],
  },
  "ruta-panoramica": {
    title: "Ruta Panoramica",
    rows: [
      { operator: "TeCaigo Tours", role: "Anfitrion", contributed: 0, paid: 0, total: 0 },
      { operator: "Aventura Local", role: "Operador", contributed: 13, paid: 11, total: 13 },
      { operator: "Ruta Viva", role: "Operador", contributed: 8, paid: 8, total: 8 },
      { operator: "Colaborador Norte", role: "Colaborador", contributed: 20, paid: 15, total: 20 },
    ],
  },
  "ruta-volcan": {
    title: "Ruta al volcan",
    rows: [
      { operator: "Volcan Tours", role: "Anfitrion", contributed: 6, paid: 6, total: 6 },
      { operator: "Cipitio Tour", role: "Operador", contributed: 12, paid: 9, total: 12 },
      { operator: "Aventura Local", role: "Operador", contributed: 6, paid: 4, total: 6 },
    ],
  },
  "tour-cafe": {
    title: "Tour cafe y mirador",
    rows: [
      { operator: "Cafe Aventura", role: "Anfitrion", contributed: 29, paid: 29, total: 29 },
      { operator: "Aventura Local", role: "Operador", contributed: 5, paid: 5, total: 5 },
    ],
  },
  "playa-nocturna": {
    title: "Ruta playa nocturna",
    rows: [
      { operator: "Pacifico Tours", role: "Anfitrion", contributed: 40, paid: 40, total: 40 },
      { operator: "Ruta Viva", role: "Operador", contributed: 4, paid: 2, total: 4 },
    ],
  },
  "lago-lancha": {
    title: "Lago, lancha y almuerzo",
    rows: [
      { operator: "Lago Tours", role: "Anfitrion", contributed: 31, paid: 29, total: 31 },
      { operator: "Operador Centro", role: "Operador", contributed: 6, paid: 3, total: 6 },
    ],
  },
};

const eventOperationDetails = {
  "nuevo-evento": {
    title: "Nuevo evento",
    description: "Completa la informacion base para crear una salida nueva.",
    state: "Borrador",
    capacity: 0,
    visibility: "Privado del cluster",
    route: "",
    mode: "Privado del cluster",
    cluster: "",
    host: "",
    price: 0,
    costs: { total: 0, guide: 0, transport: 0, other: 0 },
    commissions: { internal: "0%", external: "0%" },
    image: "",
    photoTitle: "Sin imagen del evento",
    itinerary: "",
    dates: [],
  },
  "ruta-flores": {
    title: "Ruta las flores",
    description: "Ruta publica de alta demanda para cafetales, miradores y desayuno de temporada.",
    state: "Vigente",
    capacity: 50,
    visibility: "Publico por oferta y demanda",
    route: "Ruta nacional",
    mode: "Publico con comision",
    cluster: "Ruta de las Flores",
    host: "TeCaigo Tours",
    price: 35,
    costs: { total: 980, guide: 130, transport: 750, other: 100 },
    commissions: { internal: "30%", external: "70%" },
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Mirador, flores de temporada y desayuno turistico",
    itinerary: "6:00 AM salida desde San Salvador\n8:00 AM desayuno en ruta\n10:00 AM visita a miradores\n12:30 PM almuerzo local\n3:00 PM recorrido por cafetales\n5:30 PM retorno",
    dates: [
      { date: "25/05/2026", sold: 44, internal: 30, external: 14, contrib: "Luis Valladares:4;Cipitio Tour:14;Turismo Tour:10;Aventura Local:9;Ruta Viva:7" },
    ],
  },
  "ruta-volcan": {
    title: "Ruta al volcan",
    description: "Salida privada del cluster con enfoque de caminata ligera, fotografia y comida local.",
    state: "Vigente",
    capacity: 50,
    visibility: "Privado del cluster",
    route: "Ruta nacional",
    mode: "Privado del cluster",
    cluster: "Cluster Volcan",
    host: "Volcan Tours",
    price: 28,
    costs: { total: 760, guide: 120, transport: 560, other: 80 },
    commissions: { internal: "25%", external: "0%" },
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Sendero volcanico, mirador natural y almuerzo de montana",
    itinerary: "7:00 AM salida desde San Salvador\n9:00 AM ingreso al sendero\n11:30 AM mirador principal\n1:00 PM almuerzo local\n3:30 PM retorno",
    dates: [
      { date: "20/05/2026", sold: 24, internal: 24, external: 0, contrib: "Luis Valladares:6;Cipitio Tour:8;Turismo Tour:4;Aventura Local:4;Ruta Viva:2" },
    ],
  },
  "ruta-panoramica": {
    title: "Ruta Panoramica",
    description: "Configura cupos, transporte, comisiones y visibilidad antes de abrir la oferta al cluster o al mercado publico.",
    state: "Borrador",
    capacity: 50,
    visibility: "Publico por oferta y demanda",
    route: "Ruta nacional",
    mode: "Publico con comision",
    cluster: "Ruta Panoramica",
    host: "TeCaigo Tours",
    price: 42,
    costs: { total: 1100, guide: 150, transport: 850, other: 100 },
    commissions: { internal: "30%", external: "70%" },
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Mirador, carretera panoramica y desayuno turistico",
    itinerary: "6:00 AM salida desde San Salvador\n8:00 AM desayuno en mirador\n10:00 AM recorrido guiado\n12:30 PM almuerzo local\n3:00 PM tiempo libre y fotografias\n5:00 PM retorno",
    dates: [
      { date: "25/05/2026", sold: 41, internal: 27, external: 14, contrib: "Luis Valladares:12;Cipitio Tour:11;Turismo Tour:8;Aventura Local:6;Ruta Viva:4" },
    ],
  },
  "cafe-senderos": {
    title: "Cafe y senderos",
    description: "Experiencia publica de cafe, senderismo suave y degustacion con comercios aliados.",
    state: "Vigente",
    capacity: 35,
    visibility: "Publico por oferta y demanda",
    route: "Ruta nacional",
    mode: "Publico con comision",
    cluster: "Cluster Cafe",
    host: "Cafe Aventura",
    price: 55,
    costs: { total: 980, guide: 110, transport: 650, other: 220 },
    commissions: { internal: "30%", external: "70%" },
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Sendero entre cafetales, degustacion y mirador natural",
    itinerary: "8:00 AM salida desde San Salvador\n10:00 AM caminata por sendero\n11:30 AM degustacion de cafe\n1:00 PM almuerzo\n3:00 PM mirador y retorno",
    dates: [
      { date: "25/05/2026", sold: 18, internal: 12, external: 6, contrib: "Luis Valladares:2;Cipitio Tour:6;Turismo Tour:4;Aventura Local:4;Ruta Viva:2" },
    ],
  },
  "tour-cafe": {
    title: "Tour cafe y mirador",
    description: "Evento cerrado con validacion de pago, recorrido de cafe y cupos liquidados por operador.",
    state: "Vigente",
    capacity: 50,
    visibility: "Privado del cluster",
    route: "Ruta nacional",
    mode: "Privado del cluster",
    cluster: "Cluster Maya",
    host: "Cafe Aventura",
    price: 38,
    costs: { total: 920, guide: 120, transport: 680, other: 120 },
    commissions: { internal: "30%", external: "0%" },
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Tour de cafe, mirador rural y experiencia gastronomica",
    itinerary: "8:00 AM salida\n10:00 AM recorrido de cafe\n12:00 PM almuerzo\n2:00 PM mirador\n4:00 PM retorno",
    dates: [
      { date: "20/05/2026", sold: 34, internal: 29, external: 5, contrib: "Luis Valladares:5;Cafe Aventura:14;Aventura Local:8;Ruta Viva:5;Cipitio Tour:2" },
    ],
  },
  "playa-nocturna": {
    title: "Ruta playa nocturna",
    description: "Evento cerrado con cobro pendiente, salida de tarde y experiencia nocturna en playa.",
    state: "Cobro pendiente",
    capacity: 45,
    visibility: "Publico por oferta y demanda",
    route: "Ruta nacional",
    mode: "Publico con comision",
    cluster: "Cluster Pacifico",
    host: "Pacifico Tours",
    price: 32,
    costs: { total: 860, guide: 100, transport: 650, other: 110 },
    commissions: { internal: "30%", external: "70%" },
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Atardecer, cena frente al mar y retorno nocturno",
    itinerary: "5:30 PM salida\n7:00 PM llegada a playa\n8:00 PM cena\n10:00 PM fogata y convivencia\n12:00 AM retorno",
    dates: [
      { date: "28/05/2026", sold: 44, internal: 40, external: 4, contrib: "Pacifico Tours:40;Ruta Viva:4" },
    ],
  },
  "lago-lancha": {
    title: "Lago, lancha y almuerzo",
    description: "Ruta publica con transporte terrestre, lancha y almuerzo coordinado con operadores del lago.",
    state: "Vigente",
    capacity: 40,
    visibility: "Publico por oferta y demanda",
    route: "Ruta nacional",
    mode: "Publico con comision",
    cluster: "Cluster Lago",
    host: "Lago Tours",
    price: 48,
    costs: { total: 1250, guide: 120, transport: 760, other: 370 },
    commissions: { internal: "30%", external: "70%" },
    image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=85",
    photoTitle: "Lago, recorrido en lancha y almuerzo con vista panoramica",
    itinerary: "6:30 AM salida\n9:00 AM embarque en lancha\n11:00 AM mirador del lago\n12:30 PM almuerzo\n3:30 PM retorno",
    dates: [
      { date: "02/06/2026", sold: 37, internal: 31, external: 6, contrib: "Lago Tours:31;Operador Centro:6" },
    ],
  },
};

function activateView(viewId) {
  document.body.dataset.activeView = viewId;

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMobileMenu();
}

function openMobileMenu() {
  document.body.classList.add("mobile-menu-open");
  mobileMenuToggle?.setAttribute("aria-label", "Cerrar menu");
}

function closeMobileMenu() {
  document.body.classList.remove("mobile-menu-open");
  mobileMenuToggle?.setAttribute("aria-label", "Abrir menu");
}

function toggleMobileMenu() {
  if (document.body.classList.contains("mobile-menu-open")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function isDesktopSidebarToggleTarget(event) {
  if (window.matchMedia("(max-width: 920px)").matches) return false;
  if (event.target.closest(".sidebar, .mobile-app-bar, .modal, .modal-card, .composer-dialog, .payment-dialog, .slot-request-dialog")) return false;
  if (event.target.closest("button, a, input, select, textarea, label, [role='button'], [data-open-composer], .composer-card, .wall-post, .side-panel, .event-card, .operator-event, .event-table-wrap, .admin-table, .detail-cluster, .event-form-panel, .host-agenda-shell")) return false;
  return Boolean(event.target.closest(desktopSidebarDeadZones));
}

function toggleDesktopSidebar() {
  document.body.classList.toggle("sidebar-collapsed");
}

function hydrateResponsiveTables() {
  document.querySelectorAll("table").forEach((table) => {
    table.classList.add("responsive-table");
    const headers = [...table.querySelectorAll("thead th")].map((header) => header.textContent.trim());

    table.querySelectorAll("tbody tr").forEach((row) => {
      [...row.children].forEach((cell, index) => {
        if (cell.hasAttribute("colspan")) return;
        if (!cell.dataset.label) {
          cell.dataset.label = headers[index] || "";
        }
      });
    });
  });
}

function updateBackendStatus(message, status) {
  const statusBadge = document.querySelector("[data-backend-status]");
  if (!statusBadge) return;

  statusBadge.textContent = message;
  statusBadge.classList.remove("is-checking", "is-online", "is-offline");
  statusBadge.classList.add(status);
}

function formatUserType(value) {
  const labels = {
    anfitrion: "Anfitrion de cluster",
    operador: "Tour operador",
    comercio: "Comercio turistico",
    transporte: "Transporte",
  };
  return labels[value] || value || "Sin tipo";
}

function formatRegistrationStatus(value) {
  const labels = {
    pendiente_validacion: "Pendiente validacion",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
  };
  return labels[value] || value || "Pendiente";
}

function formatStorageLabel(storage) {
  const labels = {
    postgres: "Neon PostgreSQL",
    sqlite: "SQLite local",
  };
  return labels[storage] || "Backend";
}

function renderRegistrationList(registrations = []) {
  const list = document.querySelector("[data-registration-list]");
  const count = document.querySelector("[data-registration-count]");
  if (count) count.textContent = registrations.length;
  if (!list) return;

  if (!registrations.length) {
    list.innerHTML = `<tr><td colspan="6">Aun no hay registros guardados.</td></tr>`;
    return;
  }

  list.innerHTML = registrations.map((registration) => {
    const operators = registration.linkedOperators?.length ? registration.linkedOperators.join(", ") : "Sin vinculacion";
    return `<tr>
      <td><strong>${escapeHtml(registration.companyName)}</strong><span>${escapeHtml(registration.legalRepresentative || "Sin representante")}</span></td>
      <td>${escapeHtml(formatUserType(registration.userType))}</td>
      <td>${escapeHtml(registration.bank || "Sin banco")}</td>
      <td>${escapeHtml(registration.clusterName || "No aplica")}</td>
      <td>${escapeHtml(operators)}</td>
      <td><span class="record-status">${escapeHtml(formatRegistrationStatus(registration.status))}</span></td>
    </tr>`;
  }).join("");
  hydrateResponsiveTables();
}

async function loadRegistrationsFromBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations`);
    if (!response.ok) throw new Error("No se pudieron cargar registros.");
    const payload = await response.json();
    renderRegistrationList(payload.registrations || []);
  } catch (error) {
    renderRegistrationList([]);
  }
}

async function connectBackend() {
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (!healthResponse.ok) throw new Error("El backend no respondio correctamente.");

    const eventsResponse = await fetch(`${API_BASE_URL}/events`);
    if (!eventsResponse.ok) throw new Error("No se pudieron cargar eventos.");
    const summaryResponse = await fetch(`${API_BASE_URL}/summary`);

    const payload = await eventsResponse.json();
    const summary = summaryResponse.ok ? await summaryResponse.json() : null;
    (payload.events || []).forEach((eventItem) => {
      if (!eventItem.id) return;
      const { id, ...detail } = eventItem;
      eventOperationDetails[id] = detail;
    });

    renderEventOperationDetail(eventFormPanel?.dataset.eventId || "ruta-panoramica");
    renderClusterEventDetail();
    await loadRegistrationsFromBackend();
    updateBackendStatus(
      `${formatStorageLabel(summary?.storage)}: ${summary?.eventCount ?? payload.events?.length ?? 0} eventos / ${summary?.registrationCount ?? 0} registros`,
      "is-online"
    );
  } catch (error) {
    updateBackendStatus("Modo prototipo sin backend", "is-offline");
  }
}

navItems.forEach((item) => {
  item.addEventListener("click", () => activateView(item.dataset.view));
});

mobileMenuToggle?.addEventListener("click", toggleMobileMenu);
mobileMenuOverlay?.addEventListener("click", closeMobileMenu);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    closeClusterCupComposition();
    document.body.classList.remove("sidebar-collapsed");
  }
});

document.addEventListener("focusin", (event) => {
  const field = event.target.closest("#eventFormPanel.new-event-param-mode input, #eventFormPanel.new-event-param-mode textarea");
  if (field) clearNewEventExampleValue(field);
});

function clearTasteDock() {
  tasteCarousel?.querySelectorAll(".taste-filter").forEach((filter) => {
    filter.classList.remove("dock-hover", "dock-near", "dock-far");
  });
}

function applyTasteDock(activeFilter) {
  if (!tasteCarousel || !activeFilter) return;

  const filters = Array.from(tasteCarousel.querySelectorAll(".taste-filter"));
  const activeIndex = filters.indexOf(activeFilter);
  if (activeIndex < 0) return;

  filters.forEach((filter, index) => {
    const distance = Math.abs(index - activeIndex);
    filter.classList.toggle("dock-hover", distance === 0);
    filter.classList.toggle("dock-near", distance === 1);
    filter.classList.toggle("dock-far", distance === 2);
  });
}

tasteCarousel?.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const filter = event.target.closest(".taste-filter");
  if (!filter || !tasteCarousel.contains(filter)) {
    clearTasteDock();
    return;
  }
  applyTasteDock(filter);
});

tasteCarousel?.addEventListener("pointerleave", clearTasteDock);
tasteCarousel?.addEventListener("focusin", (event) => {
  const filter = event.target.closest(".taste-filter");
  if (filter) applyTasteDock(filter);
});
tasteCarousel?.addEventListener("focusout", clearTasteDock);

function parseContributions(value) {
  return value
    .split(";")
    .map((item) => {
      const [name, count] = item.split(":");
      return { name: name.trim(), count: Number(count) || 0 };
    })
    .filter((item) => item.name);
}

function serializeContributions(contributions) {
  return contributions.map((item) => `${item.name}:${item.count}`).join(";");
}

function syncVisibleDateOption(option) {
  const sold = Number(option.dataset.sold) || 0;
  const free = Number(option.dataset.free) || 0;
  const count = option.dataset.count;
  const total = Number(option.dataset.total) || 50;
  const percent = total ? Math.round((sold / total) * 100) : 0;
  const directCount = option.querySelector(":scope > span");
  const directFree = option.querySelector(":scope > small");
  const miniRing = option.querySelector(".mini-ring");
  const miniRingText = option.querySelector(".mini-ring strong");
  const ringFree = option.querySelector(".mini-ring + div span");

  if (directCount) directCount.textContent = `${count} cupos`;
  if (directFree) directFree.textContent = `${free} disponibles`;
  if (miniRing) miniRing.style.setProperty("--fill", `${percent}%`);
  if (miniRingText) miniRingText.textContent = count;
  if (ringFree) ringFree.textContent = `${free} cupos disponibles`;
}

function syncMatchingDateOptions(selectedDate, updates) {
  document.querySelectorAll("[data-date-option]").forEach((option) => {
    if (option.dataset.dateOption !== selectedDate) return;

    Object.entries(updates).forEach(([key, value]) => {
      option.dataset[key] = String(value);
    });
    syncVisibleDateOption(option);
  });
}

function syncDateDashboard(dateOption) {
  const selectedDate = dateOption.dataset.dateOption;
  const sold = Number(dateOption.dataset.sold);
  const eventId = eventFormPanel?.dataset.eventId || "ruta-panoramica";
  const eventDetail = eventOperationDetails[eventId] || eventOperationDetails["ruta-panoramica"];
  const total = Number(dateOption.dataset.total) || eventDetail.capacity || 50;
  const price = eventDetail.price || 35;
  const totalCost = eventDetail.costs?.total || 1100;
  const fillPercent = total ? Math.round((sold / total) * 100) : 0;

  document.querySelectorAll("[data-date-option]").forEach((option) => {
    option.classList.toggle("active", option.dataset.dateOption === selectedDate);
  });

  document.querySelector("[data-selected-date]").textContent = selectedDate;
  document.querySelector("[data-selected-count]").textContent = dateOption.dataset.count;
  document.querySelector("[data-selected-free]").textContent = `${dateOption.dataset.free} cupos`;
  document.querySelector("[data-selected-status]").textContent = dateOption.dataset.status;
  document.querySelector("[data-selected-internal]").textContent = dateOption.dataset.internal;
  document.querySelector("[data-selected-external]").textContent = dateOption.dataset.external;

  const fillCard = document.querySelector("[data-fill-card]");
  fillCard?.classList.remove("fill-low", "fill-medium", "fill-high");
  fillCard?.classList.add(fillPercent < 60 ? "fill-low" : fillPercent >= 100 ? "fill-high" : "fill-medium");

  const realUnitCost = sold > 0 ? totalCost / sold : 0;
  const revenue = sold * price;
  const realMargin = revenue - totalCost;
  document.querySelector("[data-real-unit-cost]").textContent = `$${realUnitCost.toFixed(2)}`;
  document.querySelector("[data-real-unit-note]").textContent = `$${totalCost.toLocaleString("en-US")} / ${sold} vendidos`;
  document.querySelector("[data-real-margin]").textContent = `${realMargin < 0 ? "-" : ""}$${Math.abs(realMargin).toFixed(0)}`;
  document.querySelector("[data-real-margin-note]").textContent = `Venta $${revenue.toFixed(0)} - costo $${totalCost.toLocaleString("en-US")}`;

  const contributionList = document.querySelector("[data-contribution-list]");
  const contributionTitle = document.querySelector("[data-contrib-title]");
  contributionTitle.textContent = `${selectedDate} - ${dateOption.dataset.count}`;
  contributionList.innerHTML = parseContributions(dateOption.dataset.contrib)
    .map((item) => {
      const width = total ? (item.count / total) * 100 : 0;
      return `<div class="contribution-row"><div><strong>${item.name}</strong><span>${item.count}/${total} cupos</span></div><div class="contribution-bar"><span style="width: ${width}%"></span></div></div>`;
    })
    .join("");

  const currentOperator = parseContributions(dateOption.dataset.contrib).find((item) => item.name === "Aventura Local");
  const addButton = document.querySelector("[data-adjust-cupos='1']");
  const removeButton = document.querySelector("[data-adjust-cupos='-1']");

  if (addButton) addButton.disabled = sold >= total;
  if (removeButton) removeButton.disabled = !currentOperator || currentOperator.count <= 0 || sold <= 0;
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString("en-US")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeEventIdFromTitle(title) {
  return String(title || "nuevo-evento")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `evento-${Date.now()}`;
}

function makePrintableEventReport(eventId, row) {
  const detail = eventOperationDetails[eventId] || eventOperationDetails["ruta-panoramica"];
  const firstDate = detail.dates?.[0] || {};
  const rowCells = row ? [...row.children] : [];
  const rowDate = rowCells[0]?.querySelector("strong")?.textContent || firstDate.date || "Sin fecha";
  const rowHour = rowCells[0]?.querySelector("span")?.textContent || "";
  const selectedDate = detail.dates?.find((dateItem) => dateItem.date === rowDate) || firstDate;
  const sold = Number(selectedDate.sold) || 0;
  const capacity = Number(detail.capacity) || 0;
  const available = Math.max(0, capacity - sold);
  const rowCupos = `${sold}/${capacity}`;
  const rowState = rowCells[5]?.innerText || detail.state || "Sin estado";
  const averageCost = detail.capacity ? detail.costs.total / detail.capacity : 0;
  const realUnitCost = sold ? detail.costs.total / sold : 0;
  const margin = sold * (Number(detail.price) || 0) - (Number(detail.costs.total) || 0);
  const dateRows = (detail.dates || []).map((dateItem) => {
    const available = Math.max(0, (Number(detail.capacity) || 0) - (Number(dateItem.sold) || 0));
    return `<tr>
      <td>${escapeHtml(dateItem.date)}</td>
      <td>${escapeHtml(`${dateItem.sold || 0}/${detail.capacity || 0}`)}</td>
      <td>${escapeHtml(`${available} cupos`)}</td>
      <td>${escapeHtml(dateItem.internal || 0)}</td>
      <td>${escapeHtml(dateItem.external || 0)}</td>
    </tr>`;
  }).join("");
  const contributionRows = parseContributions(selectedDate.contrib || "").map((item) => `<tr>
    <td>${escapeHtml(item.name)}</td>
    <td>${escapeHtml(item.count)}</td>
  </tr>`).join("");
  const generatedAt = new Date().toLocaleString("es-SV", { dateStyle: "medium", timeStyle: "short" });
  const reportLogoSrc = new URL("./assets/tecaigo-blanco.png", window.location.href).href;

  return `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(detail.title)} - Reporte del evento</title>
      <style>
        @page { margin: 18mm; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #101818; font-family: Arial, Helvetica, sans-serif; }
        .hero { padding: 28px; color: #fff; border-radius: 14px; background: linear-gradient(135deg, #07100f, #00686b); }
        .eyebrow { margin: 0 0 8px; color: #9ff4f6; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
        h1 { margin: 0; font-size: 34px; line-height: 1.05; }
        .desc { max-width: 720px; margin: 14px 0 0; color: #dce8e8; font-size: 15px; line-height: 1.45; }
        .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 18px 0; }
        .card { min-height: 86px; padding: 14px; border: 1px solid #cfe2e2; border-radius: 10px; background: #f8fcfc; }
        .card span { display: block; margin-bottom: 8px; color: #5b6365; font-size: 12px; font-weight: 800; }
        .card strong { color: #00686b; font-size: 22px; }
        section { margin-top: 20px; }
        h2 { margin: 0 0 10px; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; overflow: hidden; border: 1px solid #d8e5e5; border-radius: 10px; }
        th, td { padding: 11px 12px; border-bottom: 1px solid #d8e5e5; text-align: left; vertical-align: top; }
        th { color: #5b6365; background: #eef8f8; font-size: 12px; text-transform: uppercase; }
        tr:last-child td { border-bottom: 0; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .notes { padding: 14px; border: 1px solid #d8e5e5; border-radius: 10px; white-space: pre-line; line-height: 1.45; }
        footer { margin-top: 26px; color: #5b6365; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="hero">
        <p class="eyebrow">TeCaiGO | Reporte imprimible del evento</p>
        <h1>${escapeHtml(detail.title)}</h1>
        <p class="desc">${escapeHtml(detail.description)}</p>
      </div>
      <div class="meta">
        <div class="card"><span>Fecha seleccionada</span><strong>${escapeHtml(rowDate)}</strong><small>${escapeHtml(rowHour)}</small></div>
        <div class="card"><span>Conteo</span><strong>${escapeHtml(rowCupos)}</strong></div>
        <div class="card"><span>Estado</span><strong>${escapeHtml(rowState)}</strong></div>
        <div class="card"><span>Visibilidad</span><strong>${escapeHtml(detail.visibility)}</strong></div>
      </div>
      <section>
        <h2>Informacion base</h2>
        <table>
          <tr><th>Ruta</th><td>${escapeHtml(detail.route)}</td><th>Cluster</th><td>${escapeHtml(detail.cluster)}</td></tr>
          <tr><th>Anfitrion</th><td>${escapeHtml(detail.host)}</td><th>Modalidad</th><td>${escapeHtml(detail.mode)}</td></tr>
          <tr><th>Precio por cupo</th><td>${escapeHtml(formatMoney(detail.price))}</td><th>Cupos del evento</th><td>${escapeHtml(detail.capacity)}</td></tr>
          <tr><th>Comision interna</th><td>${escapeHtml(detail.commissions.internal)}</td><th>Comision externa</th><td>${escapeHtml(detail.commissions.external)}</td></tr>
        </table>
      </section>
      <section>
        <h2>Costos y lectura financiera</h2>
        <table>
          <tr><th>Costos asociados</th><td>${escapeHtml(formatMoney(detail.costs.total))}</td><th>Costo promedio unitario</th><td>${escapeHtml(formatMoney(averageCost))}</td></tr>
          <tr><th>Guia</th><td>${escapeHtml(formatMoney(detail.costs.guide))}</td><th>Transporte</th><td>${escapeHtml(formatMoney(detail.costs.transport))}</td></tr>
          <tr><th>Otros costos</th><td>${escapeHtml(formatMoney(detail.costs.other))}</td><th>Costo unitario real</th><td>${escapeHtml(formatMoney(realUnitCost))}</td></tr>
          <tr><th>Margen fecha</th><td colspan="3">${escapeHtml(formatMoney(margin))}</td></tr>
        </table>
      </section>
      <section class="two">
        <div>
          <h2>Fechas disponibles</h2>
          <table>
            <thead><tr><th>Fecha</th><th>Conteo</th><th>Disponibles</th><th>Internos</th><th>Externos</th></tr></thead>
            <tbody>${dateRows || '<tr><td colspan="5">Sin fechas registradas</td></tr>'}</tbody>
          </table>
        </div>
        <div>
          <h2>Aporte por integrante</h2>
          <table>
            <thead><tr><th>Tour operador</th><th>Cupos</th></tr></thead>
            <tbody>${contributionRows || '<tr><td colspan="2">Sin aportes registrados</td></tr>'}</tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>Itinerario</h2>
        <div class="notes">${escapeHtml(detail.itinerary || "Sin itinerario registrado")}</div>
      </section>
      <footer>Generado el ${escapeHtml(generatedAt)} desde el prototipo TeCaiGO.</footer>
    </body>
  </html>`;
}

function printEventReport(eventId, row) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const printDocument = iframe.contentWindow?.document;
  if (!printDocument) return;

  printDocument.open();
  printDocument.write(makePrintableEventReport(eventId, row));
  printDocument.close();

  let didPrint = false;
  const requestPrint = () => {
    if (didPrint) return;
    didPrint = true;
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1000);
  };
  iframe.onload = requestPrint;
  setTimeout(requestPrint, 250);
}

function parseMoneyValue(value) {
  return Number(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

function getBlankEventDetail() {
  return {
    title: "Nuevo evento",
    description: "Completa la informacion base para crear una salida nueva.",
    state: "Borrador",
    capacity: 0,
    visibility: "Privado del cluster",
    route: "",
    mode: "Privado del cluster",
    cluster: "",
    host: "",
    price: 0,
    costs: { total: 0, guide: 0, transport: 0, other: 0 },
    commissions: { internal: "0%", external: "0%" },
    image: "",
    photoTitle: "Sin imagen del evento",
    itinerary: "",
    dates: [],
  };
}

function makeDateOptionMarkup(dateItem, detail, isActive, isRing = false) {
  const total = detail.capacity || 0;
  const free = Math.max(0, total - dateItem.sold);
  const percent = total ? Math.round((dateItem.sold / total) * 100) : 0;
  const status = `${percent}% lleno`;
  const attrs = `data-date-option="${dateItem.date}" data-total="${total}" data-count="${dateItem.sold}/${total}" data-free="${free}" data-internal="${dateItem.internal}" data-external="${dateItem.external}" data-status="${status}" data-sold="${dateItem.sold}" data-contrib="${dateItem.contrib}"`;

  if (isRing) {
    return `<button class="date-ring-item${isActive ? " active" : ""}" type="button" ${attrs}>
      <div class="mini-ring" style="--fill: ${percent}%"><strong>${dateItem.sold}/${total}</strong></div>
      <div><strong>${dateItem.date}</strong><span>${free} cupos disponibles</span></div>
    </button>`;
  }

  return `<button class="${isActive ? "active" : ""}" type="button" ${attrs}><strong>${dateItem.date}</strong></button>`;
}

function setValue(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.value = value;
}

function setPlaceholder(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.placeholder = value;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setNewEventParamMode(isParamMode, mode = "blank") {
  eventFormPanel?.classList.toggle("new-event-param-mode", isParamMode);
  const isInherited = mode === "inherited";
  setText("[data-editor-kicker]", isParamMode ? "Parametrizacion" : "CRUD del evento");
  setText("[data-editor-state]", isParamMode ? (isInherited ? "Reprogramar evento" : "Nuevo evento") : "Vista de detalle");
  setText(
    "[data-editor-note]",
    isParamMode
      ? isInherited
        ? "Datos heredados del evento actual para cambiar fecha, foto, titulo o parametros puntuales."
        : "Define los parametros base del evento antes de abrir cupos, fechas o mercado publico."
      : "Gestiona la informacion base, cupos, costos, fechas y visibilidad comercial."
  );
  setText("[data-crud-new-label]", isParamMode ? (isInherited ? "Limpiar fecha" : "Limpiar") : "Nueva fecha");
  setText("[data-crud-edit-label]", isParamMode ? "Editar" : "Editar");
  setText("[data-crud-save-label]", isParamMode ? "Guardar parametros" : "Guardar");
}

function prepareNewEventCaptureFields() {
  const examples = {
    "[data-event-input-name]": "Ej. Ruta de cafe y mirador",
    "[data-event-input-host]": "Ej. TeCaigo Tours",
    "[data-event-input-dates]": "Ej. 25/05/2026, 01/06/2026",
    "[data-event-input-price]": "Ej. $35",
    "[data-event-input-guide]": "Ej. $130",
    "[data-event-input-transport]": "Ej. $750",
    "[data-event-input-other-costs]": "Ej. $100",
    "[data-event-input-capacity]": "Ej. 50",
    "[data-event-input-internal-commission]": "Ej. 30%",
    "[data-event-input-external-commission]": "Ej. 70%",
    "[data-event-input-itinerary]": "Ej. 6:00 AM salida, 8:00 AM desayuno, 10:00 AM recorrido...",
  };

  Object.entries(examples).forEach(([selector, placeholder]) => {
    setPlaceholder(selector, placeholder);
    setValue(selector, "");
  });

  setValue("[data-event-input-route]", "");
  setValue("[data-event-input-cluster]", "");
  setValue("[data-event-input-transport-provider]", "");
  setValue("[data-event-input-visibility]", "Privado del cluster");
  setText("[data-event-photo-file-name]", "Ej. mirador, playa o punto principal del viaje");
  renderSelectedDateCards([]);
}

function clearNewEventExampleValue(field) {
  if (!eventFormPanel?.classList.contains("new-event-param-mode")) return;
  if (!field.matches("input, textarea")) return;

  const disposableValues = new Set(["Nuevo evento", "$0", "$0.00", "0", "0%", "Sin imagen del evento"]);
  if (disposableValues.has(field.value.trim())) field.value = "";
}

function parseEventDateValue(value) {
  const [day, month, year] = String(value || "").split("/").map(Number);
  if (!day || !month || !year) return null;
  return { day, month: month - 1, year };
}

function formatEventDateValue(day, month = paramCalendarState.month, year = paramCalendarState.year) {
  return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
}

function getSelectedEventDates() {
  return (document.querySelector("[data-event-input-dates]")?.value || "")
    .split(",")
    .map((date) => date.trim())
    .filter(Boolean);
}

function setSelectedEventDates(dates) {
  const uniqueDates = [...new Set(dates)].sort((a, b) => {
    const first = parseEventDateValue(a);
    const second = parseEventDateValue(b);
    if (!first || !second) return a.localeCompare(b);
    return new Date(first.year, first.month, first.day) - new Date(second.year, second.month, second.day);
  });
  setValue("[data-event-input-dates]", uniqueDates.join(", "));
  renderSelectedDateCards(uniqueDates);
}

function renderSelectedDateCards(dates = getSelectedEventDates()) {
  const container = document.querySelector("[data-event-param-date-cards]");
  if (!container) return;

  container.innerHTML = dates.length
    ? dates.map((date) => `<button type="button" data-param-date-card="${date}">${date}</button>`).join("")
    : `<span>Sin fechas seleccionadas</span>`;
}

function syncCalendarSelectors() {
  const monthSelect = document.querySelector("[data-param-calendar-month]");
  const yearSelect = document.querySelector("[data-param-calendar-year]");
  const monthNames = [...Array(12)].map((_, index) => new Intl.DateTimeFormat("es-SV", { month: "short" }).format(new Date(2026, index, 1)));

  if (monthSelect && !monthSelect.options.length) {
    monthSelect.innerHTML = monthNames.map((month, index) => `<option value="${index}">${month}</option>`).join("");
  }

  if (yearSelect && !yearSelect.options.length) {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]
      .map((year) => `<option value="${year}">${year}</option>`)
      .join("");
  }

  if (monthSelect) monthSelect.value = String(paramCalendarState.month);
  if (yearSelect) yearSelect.value = String(paramCalendarState.year);
}

function getClusterProgrammedDays(detail, month, year) {
  const cluster = detail?.cluster;
  const days = new Set();
  const details = Object.entries(eventOperationDetails)
    .filter(([id, item]) => id !== "nuevo-evento" && item?.dates?.length)
    .map(([, item]) => item);

  details
    .filter((item) => (cluster ? item.cluster === cluster : item === detail))
    .forEach((item) => {
      item.dates.forEach((dateItem) => {
        const parsed = parseEventDateValue(dateItem.date);
        if (parsed?.month === month && parsed.year === year) days.add(parsed.day);
      });
    });

  return days;
}

function renderParamClusterCalendar(detail, shouldShow) {
  const grid = document.querySelector("[data-event-param-calendar-grid]");
  if (!grid || !shouldShow) return;

  syncCalendarSelectors();
  const year = paramCalendarState.year;
  const month = paramCalendarState.month;
  const monthLabel = new Intl.DateTimeFormat("es-SV", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const programmedDays = getClusterProgrammedDays(detail, month, year);
  const selectedDates = new Set(getSelectedEventDates());
  const weekdays = ["D", "L", "M", "M", "J", "V", "S"];
  const cells = weekdays.map((day) => `<span class="calendar-weekday">${day}</span>`);

  for (let index = 0; index < firstDay; index += 1) {
    cells.push(`<span class="calendar-day muted"></span>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = formatEventDateValue(day, month, year);
    const classes = [
      "calendar-day",
      programmedDays.has(day) ? "programmed" : "",
      selectedDates.has(date) ? "selected" : "",
    ].filter(Boolean).join(" ");
    cells.push(`<button class="${classes}" type="button" data-param-calendar-day="${day}">${day}</button>`);
  }

  setText("[data-event-param-calendar-month]", monthLabel);
  setText(
    "[data-event-param-calendar-note]",
    programmedDays.size ? `${programmedDays.size} dia programado por ${detail.cluster || "este cluster"}` : "Sin dias programados este mes"
  );
  grid.innerHTML = cells.join("");
  renderSelectedDateCards([...selectedDates]);
}

function syncParamImagePreview(detail, shouldShow) {
  const preview = document.querySelector("[data-event-param-image-preview]");
  const image = document.querySelector("[data-event-param-preview-image]");
  if (!preview) return;

  const hasImage = Boolean(detail?.image);
  preview.hidden = !shouldShow;
  preview.classList.toggle("is-empty", !hasImage);
  if (!shouldShow) return;

  if (image) {
    if (hasImage) image.src = detail.image;
    else image.src = EMPTY_EVENT_IMAGE;
    image.alt = `Foto del evento ${detail.title || "seleccionado"}`;
  }
  setText("[data-event-param-preview-title]", hasImage ? detail.photoTitle || detail.title : "Foto pendiente del evento");
  renderParamClusterCalendar(detail, true);
}

function setEventPhotoFromFile(file) {
  if (!file) return;

  const eventId = eventFormPanel?.dataset.eventId || "nuevo-evento";
  const detail = eventOperationDetails[eventId] || getBlankEventDetail();
  const reader = new FileReader();

  reader.onload = () => {
    detail.image = String(reader.result || "");
    detail.photoTitle = file.name;
    eventOperationDetails[eventId] = detail;

    const image = document.querySelector("[data-event-form-image]");
    const photo = document.querySelector(".event-detail-photo");
    if (image) image.src = detail.image;
    if (photo) photo.classList.remove("is-empty");
    setText("[data-event-form-photo-title]", file.name);
    setText("[data-event-photo-file-name]", file.name);
    syncParamImagePreview(detail, eventFormPanel?.classList.contains("new-event-param-mode"));
  };

  reader.readAsDataURL(file);
}

function setEventEditMode(isEditing) {
  eventFormPanel?.classList.toggle("editing", isEditing);
  if (eventFormPanel?.classList.contains("new-event-param-mode")) return;
  setText("[data-editor-state]", isEditing ? "Editando evento" : "Vista de detalle");
}

function keepEventPanelGlobal() {
  if (eventFormPanel && eventFormPanel.parentElement !== document.body) {
    document.body.appendChild(eventFormPanel);
  }
}

function updatePublicReplicaState(isPublic) {
  const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || eventOperationDetails["nuevo-evento"];
  const switchInput = document.querySelector("[data-event-public-switch]");
  const visibilityInput = document.querySelector("[data-event-input-visibility]");
  const title = document.querySelector("[data-public-switch-title]");
  const note = document.querySelector("[data-public-switch-note]");
  const previewCard = document.querySelector("[data-public-preview-card]");

  if (switchInput) switchInput.checked = isPublic;
  if (visibilityInput) visibilityInput.value = isPublic ? "Publico por oferta y demanda" : "Privado del cluster";
  setText("[data-event-form-visibility]", isPublic ? "Publico por oferta y demanda" : "Privado del cluster");
  if (title) title.textContent = isPublic ? "Publico" : "Privado";
  if (note) {
    note.textContent = isPublic
      ? "Se replica en Eventos publicos para recibir ayuda de otros operadores."
      : "Solo visible para el cluster asignado.";
  }
  if (previewCard) {
    previewCard.hidden = !isPublic;
    setText("[data-public-preview-title]", detail.title || "Nuevo evento publico");
    setText("[data-public-preview-host]", `Anfitrion: ${detail.host || "pendiente"}`);
    setText("[data-public-preview-route]", detail.route || "Ruta por definir");
    setText("[data-public-preview-commission]", `Comision externo ${detail.commissions?.external || "pendiente"}`);
    const firstDate = detail.dates?.[0];
    const total = Number(detail.capacity) || 0;
    const sold = Number(firstDate?.sold) || 0;
    setText("[data-public-preview-count]", `${sold}/${total}`);
    setText("[data-public-preview-free]", `${Math.max(0, total - sold)} cupos libres`);
    const previewImage = document.querySelector("[data-public-preview-image]");
    if (previewImage) {
      previewImage.innerHTML = detail.image ? `<img src="${detail.image}" alt="Foto del evento ${detail.title}" />` : "Sin imagen";
    }
  }
}

function renderEmptyDateDashboard() {
  setText("[data-selected-date]", "Sin fecha");
  setText("[data-selected-count]", "0/0");
  setText("[data-selected-free]", "0 cupos");
  setText("[data-selected-status]", "Sin programacion");
  setText("[data-selected-internal]", "0");
  setText("[data-selected-external]", "0");
  setText("[data-event-fill-percent]", "0%");
  setText("[data-real-unit-cost]", "$0.00");
  setText("[data-real-unit-note]", "$0 / 0 vendidos");
  setText("[data-real-margin]", "$0");
  setText("[data-real-margin-note]", "Venta $0 - costo $0");
  setText("[data-contrib-title]", "Sin fecha - 0/0");
  const contributionList = document.querySelector("[data-contribution-list]");
  if (contributionList) contributionList.innerHTML = `<div class="empty-filter-state show">Sin aportes registrados.</div>`;
}

function renderEventOperationDetail(eventId = "ruta-panoramica", options = {}) {
  const detail = eventOperationDetails[eventId] || eventOperationDetails["ruta-panoramica"];
  if (!eventFormPanel || !detail) return;

  eventFormPanel.dataset.eventId = eventId;
  const isParamMode = eventId === "nuevo-evento" || options.paramMode;
  const paramModeType = options.inherited ? "inherited" : "blank";
  const averageCost = detail.capacity ? detail.costs.total / detail.capacity : 0;
  setEventEditMode(eventId === "nuevo-evento" || options.inherited);
  setNewEventParamMode(isParamMode, paramModeType);
  setText("[data-event-form-title]", detail.title);
  setText("[data-event-form-description]", detail.description);
  setText("[data-event-form-state]", detail.state);
  setText("[data-event-form-capacity]", `${detail.capacity} cupos`);
  setText("[data-event-form-visibility]", detail.visibility);
  setText("[data-event-form-photo-title]", detail.photoTitle);
  setText("[data-event-form-price]", formatMoney(detail.price));
  setText("[data-event-form-price-note]", "Venta por persona");
  setText("[data-event-form-cost]", formatMoney(detail.costs.total));
  setText("[data-event-form-cost-note]", `Guia ${formatMoney(detail.costs.guide)} + transporte ${formatMoney(detail.costs.transport)} + otros ${formatMoney(detail.costs.other)}`);
  setText("[data-event-form-average-cost]", formatMoney(averageCost));
  setText("[data-event-form-average-note]", `${formatMoney(detail.costs.total)} / ${detail.capacity} cupos`);
  setText("[data-event-summary-route]", detail.route);
  setText("[data-event-summary-mode]", detail.mode);
  setText("[data-event-summary-commission]", `Interno ${detail.commissions.internal} / Externo ${detail.commissions.external}`);
  setText("[data-event-summary-average]", `${formatMoney(averageCost)} por cupo`);
  setText("[data-event-summary-margin]", `${formatMoney(detail.price * detail.capacity - detail.costs.total)} lleno`);

  const stateBadge = document.querySelector("[data-event-form-state]");
  stateBadge?.classList.remove("draft", "active", "closed", "review");
  stateBadge?.classList.add(detail.state === "Borrador" ? "draft" : detail.state === "Cerrado" ? "closed" : detail.state.includes("pendiente") ? "review" : "active");

  const image = document.querySelector("[data-event-form-image]");
  const photo = document.querySelector(".event-detail-photo");
  photo?.classList.toggle("is-empty", !detail.image);
  if (image) {
    if (detail.image) image.src = detail.image;
    image.alt = `Foto del evento ${detail.title}`;
  }
  setText("[data-event-photo-file-name]", detail.image ? detail.photoTitle : "Ej. mirador, playa o punto principal del viaje");

  setValue("[data-event-input-name]", detail.title);
  setValue("[data-event-input-route]", detail.route);
  setValue("[data-event-input-visibility]", detail.visibility);
  setValue("[data-event-input-cluster]", detail.cluster);
  setValue("[data-event-input-host]", detail.host);
  setValue("[data-event-input-dates]", detail.dates.map((item) => item.date).join(", "));
  setValue("[data-event-input-price]", formatMoney(detail.price));
  setValue("[data-event-input-guide]", formatMoney(detail.costs.guide));
  setValue("[data-event-input-transport]", formatMoney(detail.costs.transport));
  setValue("[data-event-input-other-costs]", formatMoney(detail.costs.other));
  setValue("[data-event-input-average-cost]", formatMoney(averageCost));
  setValue("[data-event-input-capacity]", detail.capacity);
  setValue("[data-event-input-internal-commission]", detail.commissions.internal);
  setValue("[data-event-input-external-commission]", detail.commissions.external);
  setValue("[data-event-input-itinerary]", detail.itinerary);
  if (eventId === "nuevo-evento" && !options.inherited) prepareNewEventCaptureFields();
  syncParamImagePreview(detail, isParamMode);

  const dateList = document.querySelector(".event-date-list");
  const ringList = document.querySelector(".date-ring-list");
  const emptyDateState = `<div class="empty-filter-state show">Sin fechas agregadas.</div>`;
  if (dateList) dateList.innerHTML = detail.dates.length ? detail.dates.map((item, index) => makeDateOptionMarkup(item, detail, index === 0)).join("") : emptyDateState;
  if (ringList) ringList.innerHTML = detail.dates.length ? detail.dates.map((item, index) => makeDateOptionMarkup(item, detail, index === 0, true)).join("") : emptyDateState;

  const firstDateButton = document.querySelector(".event-date-list [data-date-option]");
  if (firstDateButton) syncDateDashboard(firstDateButton);
  else renderEmptyDateDashboard();

  const eventRow = document.querySelector(`[data-internal-event-row][data-event-id="${eventId}"]`);
  const filled = Number(eventRow?.dataset.filled || detail.dates?.[0]?.sold || 0);
  const total = Number(eventRow?.dataset.total || detail.capacity || 0);
  const fillPercent = total ? Math.round((filled / total) * 100) : 0;
  setText("[data-event-fill-percent]", `${fillPercent}%`);

  updatePublicReplicaState(detail.visibility === "Publico por oferta y demanda");
}

function openBlankEventForm() {
  eventOperationDetails["nuevo-evento"] = getBlankEventDetail();
  renderEventOperationDetail("nuevo-evento");
  keepEventPanelGlobal();
  eventFormPanel?.classList.remove("minimized", "maximized");
  eventFormPanel?.style.removeProperty("--event-drag-x");
  eventFormPanel?.style.removeProperty("--event-drag-y");
  eventFormPanel?.classList.add("open");
  eventFormPanel?.setAttribute("aria-hidden", "false");
}

function openInheritedEventParamForm(sourceEventId) {
  const currentId = sourceEventId || eventFormPanel?.dataset.eventId || "ruta-panoramica";
  const source = eventOperationDetails[currentId] || eventOperationDetails["ruta-panoramica"];
  const inherited = JSON.parse(JSON.stringify(source));
  const inheritedId = "evento-heredado";

  inherited.state = "Borrador";
  inherited.description = `${source.title} heredado para programar una nueva salida sin volver a capturar toda la informacion.`;
  eventOperationDetails[inheritedId] = inherited;
  renderEventOperationDetail(inheritedId, { paramMode: true, inherited: true });
  keepEventPanelGlobal();
  eventFormPanel?.classList.remove("minimized", "maximized");
  eventFormPanel?.style.removeProperty("--event-drag-x");
  eventFormPanel?.style.removeProperty("--event-drag-y");
  eventFormPanel?.classList.add("open");
  eventFormPanel?.setAttribute("aria-hidden", "false");
  document.querySelector("[data-event-input-dates]")?.focus();
}

function openInheritedDateForm() {
  openInheritedEventParamForm();
}

async function saveEventToBackend(eventId, detail) {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: eventId, ...detail }),
    });

    if (!response.ok) throw new Error("El backend rechazo el guardado.");

    const payload = await response.json();
    if (payload.event?.id) {
      const { id, ...savedDetail } = payload.event;
      eventOperationDetails[id] = savedDetail;
      eventFormPanel.dataset.eventId = id;
    }
    updateBackendStatus("Evento guardado en backend", "is-online");
  } catch (error) {
    updateBackendStatus("Guardado local, backend no disponible", "is-offline");
  }
}

function collectRegistrationFormData() {
  const data = {};
  document.querySelectorAll("[data-registration-field]").forEach((field) => {
    data[field.dataset.registrationField] = field.value || "";
  });

  data.clusterName = document.querySelector("[data-cluster-name]")?.value || "";
  data.linkedOperators = [...document.querySelectorAll("[data-linked-operator-list] span")].map((chip) =>
    chip.dataset.operatorName || chip.childNodes[0]?.textContent.trim()
  );
  return data;
}

async function saveRegistrationToBackend() {
  const registration = collectRegistrationFormData();
  if (!registration.companyName.trim()) {
    updateBackendStatus("Falta nombre de empresa", "is-offline");
    document.querySelector("[data-registration-field='companyName']")?.focus();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registration),
    });

    if (!response.ok) throw new Error("El backend rechazo el registro.");

    const payload = await response.json();
    updateBackendStatus(`Registro guardado: ${payload.registration.companyName}`, "is-online");
    await loadRegistrationsFromBackend();
  } catch (error) {
    updateBackendStatus("Registro no enviado, backend no disponible", "is-offline");
  }
}

function applyEventFormInputsToView() {
  const eventId = eventFormPanel?.dataset.eventId || "nuevo-evento";
  const staysInParamMode = eventFormPanel?.classList.contains("new-event-param-mode");
  const detail = eventOperationDetails[eventId] || getBlankEventDetail();
  const capacity = Number(document.querySelector("[data-event-input-capacity]")?.value) || 0;
  const guide = parseMoneyValue(document.querySelector("[data-event-input-guide]")?.value);
  const transport = parseMoneyValue(document.querySelector("[data-event-input-transport]")?.value);
  const other = parseMoneyValue(document.querySelector("[data-event-input-other-costs]")?.value);
  const dates = (document.querySelector("[data-event-input-dates]")?.value || "")
    .split(",")
    .map((date) => date.trim())
    .filter(Boolean);

  detail.title = document.querySelector("[data-event-input-name]")?.value || "Nuevo evento";
  detail.route = document.querySelector("[data-event-input-route]")?.value || "";
  detail.visibility = document.querySelector("[data-event-input-visibility]")?.value || "Privado del cluster";
  detail.mode = detail.visibility === "Publico por oferta y demanda" ? "Publico con comision" : "Privado del cluster";
  detail.cluster = document.querySelector("[data-event-input-cluster]")?.value || "";
  detail.host = document.querySelector("[data-event-input-host]")?.value || "";
  detail.price = parseMoneyValue(document.querySelector("[data-event-input-price]")?.value);
  detail.capacity = capacity;
  detail.costs = { total: guide + transport + other, guide, transport, other };
  detail.commissions = {
    internal: document.querySelector("[data-event-input-internal-commission]")?.value || "0%",
    external: document.querySelector("[data-event-input-external-commission]")?.value || "0%",
  };
  detail.itinerary = document.querySelector("[data-event-input-itinerary]")?.value || "";
  detail.dates = dates.map((date) => ({
    date,
    sold: 0,
    internal: 0,
    external: 0,
    contrib: `${detail.host || "Anfitrion"}:0`,
  }));
  detail.description = detail.visibility === "Publico por oferta y demanda"
    ? "Evento abierto al mercado publico para recibir apoyo de otros operadores."
    : "Evento privado del cluster, listo para coordinar cupos internos.";
  detail.photoTitle = detail.image ? detail.photoTitle : "Sin imagen del evento";

  const nextEventId = ["nuevo-evento", "nueva-fecha"].includes(eventId) ? makeEventIdFromTitle(detail.title) : eventId;
  eventOperationDetails[nextEventId] = detail;
  if (nextEventId !== eventId) delete eventOperationDetails[eventId];
  eventFormPanel.dataset.eventId = nextEventId;
  renderEventOperationDetail(nextEventId, { paramMode: staysInParamMode, inherited: staysInParamMode && eventId !== "nuevo-evento" });
  setEventEditMode(false);
  saveEventToBackend(nextEventId, detail);
}

function adjustSelectedDateCupos(delta) {
  const activeOption =
    document.querySelector(".event-date-list [data-date-option].active") ||
    document.querySelector("[data-date-option].active");

  if (!activeOption) return;

  const selectedDate = activeOption.dataset.dateOption;
  const sold = Number(activeOption.dataset.sold) || 0;
  const total = Number(activeOption.dataset.total) || eventOperationDetails[eventFormPanel?.dataset.eventId]?.capacity || 50;
  const nextSold = Math.max(0, Math.min(total, sold + delta));

  if (nextSold === sold) return;

  const contributions = parseContributions(activeOption.dataset.contrib);
  let currentOperator = contributions.find((item) => item.name === "Aventura Local");

  if (!currentOperator) {
    if (delta < 0) return;
    currentOperator = { name: "Aventura Local", count: 0 };
    contributions.push(currentOperator);
  }

  if (delta < 0 && currentOperator.count <= 0) return;

  currentOperator.count += delta;

  const internal = Math.max(0, (Number(activeOption.dataset.internal) || 0) + delta);
  const free = total - nextSold;
  const count = `${nextSold}/${total}`;
  const status = `${Math.round((nextSold / total) * 100)}% lleno`;
  const contrib = serializeContributions(contributions);

  syncMatchingDateOptions(selectedDate, {
    sold: nextSold,
    free,
    count,
    status,
    internal,
    contrib,
  });

  const refreshedOption =
    document.querySelector(`.event-date-list [data-date-option].active`) ||
    document.querySelector("[data-date-option].active");

  syncDateDashboard(refreshedOption || activeOption);
}

function openSlotRequestModal(button) {
  if (!slotRequestModal) return;

  slotRequestModal.dataset.event = button.dataset.requestEvent || "Ruta Panoramica";
  slotRequestModal.dataset.host = button.dataset.requestHost || "TeCaigo Tours";
  slotRequestModal.dataset.free = button.dataset.requestFree || "9";
  slotRequestModal.dataset.commission = button.dataset.requestCommission || "70%";

  slotRequestModal.querySelector("[data-slot-request-event]").textContent = slotRequestModal.dataset.event;
  slotRequestModal.querySelector("[data-slot-request-host]").textContent = slotRequestModal.dataset.host;
  slotRequestModal.querySelector("[data-slot-request-free]").textContent = slotRequestModal.dataset.free;
  slotRequestModal.querySelector("[data-slot-request-commission]").value = slotRequestModal.dataset.commission;

  const countInput = slotRequestModal.querySelector("[data-slot-request-count]");
  if (countInput) {
    countInput.max = slotRequestModal.dataset.free;
    countInput.value = String(Math.min(4, Number(slotRequestModal.dataset.free) || 1));
  }

  slotRequestModal.classList.add("open");
  slotRequestModal.setAttribute("aria-hidden", "false");
  countInput?.focus();
}

function closeSlotRequestModal() {
  slotRequestModal?.classList.remove("open");
  slotRequestModal?.setAttribute("aria-hidden", "true");
}

function appendSlotRequest(eventName, host, count, commission, free) {
  const requestList = document.querySelector("[data-slot-request-list]");
  if (!requestList) return;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><strong>${eventName}</strong><span class="event-open">Publico</span></td>
    <td>${host}</td>
    <td><b class="transfer-amount">${count}</b></td>
    <td>${commission}</td>
    <td>${free}</td>
    <td><span class="matrix-status draft">Pendiente</span></td>
  `;
  requestList.prepend(row);
}

function applyMyEventsFilter(filterType = "todos") {
  document.querySelectorAll("[data-my-event-card]").forEach((card) => {
    const isVisible =
      filterType === "todos" ||
      card.dataset.myEventState === filterType ||
      (filterType === "riesgo" && card.dataset.myEventRisk === "true");
    card.classList.toggle("is-hidden", !isVisible);
  });
}

function applyWeekSegmentFilter(segmentButton) {
  const filter = segmentButton.dataset.weekFilter || "todos";
  const label =
    filter === "todos"
      ? "Todos los eventos"
      : `${segmentButton.querySelector("strong")?.textContent || ""} ${segmentButton.querySelector("small")?.textContent || ""}`.trim();

  document.querySelectorAll("[data-week-filter]").forEach((button) => {
    button.classList.toggle("active", button === segmentButton);
  });

  document.querySelectorAll(".host-agenda-matrix [data-my-event-card]").forEach((row) => {
    row.classList.toggle("is-hidden", filter !== "todos" && row.dataset.weekSegment !== filter);
  });

  const summary = document.querySelector("[data-week-filter-summary]");
  if (summary) summary.textContent = label;
}

function filterRowsByWeek(filter) {
  document.querySelectorAll(".host-agenda-matrix [data-my-event-card]").forEach((row) => {
    row.classList.toggle("is-hidden", filter !== "todos" && row.dataset.weekSegment !== filter);
  });
}

function getDateSegment(year, month, day) {
  const options = dateSegments[`${year}-${month}`] || dateSegments["2026-05"];
  return options.find((item) => item.day === day) || options[0];
}

function updateDateSegmentResult(selected) {
  filterRowsByWeek(selected.value);

  const title = document.querySelector("[data-week-result-title]");
  const range = document.querySelector("[data-week-result-range]");
  const count = document.querySelector("[data-week-result-count]");
  const summary = document.querySelector("[data-week-filter-summary]");

  if (title) title.textContent = selected.title;
  if (range) range.textContent = selected.range;
  if (count) count.textContent = selected.count;
  if (summary) summary.textContent = `${selected.title} ${selected.range}`.trim();
}

function closeCalendarPopover() {
  const popover = document.querySelector("[data-calendar-popover]");
  const trigger = document.querySelector("[data-calendar-toggle]");
  popover?.setAttribute("hidden", "");
  trigger?.setAttribute("aria-expanded", "false");
}

function toggleCalendarPopover() {
  const popover = document.querySelector("[data-calendar-popover]");
  const trigger = document.querySelector("[data-calendar-toggle]");
  if (!popover || !trigger) return;

  const isOpening = popover.hasAttribute("hidden");
  popover.toggleAttribute("hidden", !isOpening);
  trigger.setAttribute("aria-expanded", String(isOpening));
}

function syncAdminRegistrationType() {
  const type = document.querySelector("[data-admin-user-type]")?.value;
  const clusterPanel = document.querySelector("[data-cluster-link-panel]");
  clusterPanel?.classList.toggle("is-hidden", type !== "anfitrion");
}

function syncAvailableOperators() {
  const select = document.querySelector("[data-available-operator]");
  const linkedNames = [...document.querySelectorAll("[data-linked-operator-list] span")].map((chip) =>
    chip.dataset.operatorName || chip.childNodes[0]?.textContent.trim()
  );
  const addButton = document.querySelector("[data-add-cluster-operator]");
  if (!select) return;

  const operatorNames = select.dataset.operatorNames
    ? select.dataset.operatorNames.split("|")
    : [...select.options].filter((option) => option.value).map((option) => option.value);
  select.dataset.operatorNames = operatorNames.join("|");
  const availableNames = operatorNames.filter((name) => !linkedNames.includes(name));

  select.innerHTML = availableNames.length
    ? availableNames.map((name) => `<option value="${name}">${name}</option>`).join("")
    : '<option value="" selected disabled>Sin operadores disponibles</option>';
  select.disabled = !availableNames.length;
  if (addButton) addButton.disabled = !availableNames.length;
}

function renderClusterEventDetail(eventId = "ruta-panoramica") {
  const detail = clusterEventDetails[eventId] || clusterEventDetails["ruta-panoramica"];
  const title = document.querySelector("[data-cluster-detail-title]");
  const body = document.querySelector("[data-cluster-detail-body]");
  if (!body) return;

  document.querySelectorAll("[data-event-detail]").forEach((row) => {
    row.classList.toggle("selected-row", row.dataset.eventDetail === eventId);
  });

  if (title) title.textContent = detail.title;
  body.innerHTML = detail.rows
    .map((item, index) => {
      const pending = Math.max(0, item.total - item.paid);
      return `
        <tr>
          <td><strong>${item.operator}</strong><span>${index === 0 ? "Anfitrion" : item.role}</span></td>
          <td><b>${item.contributed}</b><span>cupos</span></td>
          <td><b>${item.paid} / ${item.total}</b><span>pagados / cierre</span></td>
          <td><b>${pending}</b><span>pendientes</span></td>
        </tr>
      `;
    })
    .join("");
}

function getWeekOfYearMonday(date) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const startDayOffset = (yearStart.getDay() + 6) % 7;
  const firstWeekStart = new Date(yearStart);
  firstWeekStart.setDate(yearStart.getDate() - startDayOffset);
  return Math.floor((date - firstWeekStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function renderCalendarPicker(selectedDay = 0) {
  const grid = document.querySelector("[data-calendar-grid]");
  const year = Number(document.querySelector("[data-date-year]")?.value) || 2026;
  const month = Number(document.querySelector("[data-date-month]")?.value) || 5;
  if (!grid) return;

  const days = ["SEM", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
  const firstDate = new Date(year, month - 1, 1);
  const firstMondayOffset = (firstDate.getDay() + 6) % 7;
  const startDate = new Date(year, month - 1, 1 - firstMondayOffset);
  const activeDays = (dateSegments[`${year}-${String(month).padStart(2, "0")}`] || []).filter((item) => item.day > 0);

  grid.innerHTML = days.map((day) => `<span class="calendar-cell header">${day}</span>`).join("");

  for (let week = 0; week < 6; week += 1) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + week * 7);
    const weekNumber = getWeekOfYearMonday(weekStart);
    grid.insertAdjacentHTML("beforeend", `<span class="calendar-cell week">${weekNumber}</span>`);

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayIndex);
      const isCurrentMonth = date.getMonth() === month - 1;
      const day = date.getDate();
      const eventSegment = activeDays.find((item) => item.day === day && isCurrentMonth);
      const classes = [
        "calendar-cell",
        !isCurrentMonth ? "muted" : "",
        eventSegment ? "event-day" : "",
        isCurrentMonth && day === selectedDay ? "selected" : "",
        year === 2026 && month === 5 && day === 15 ? "today" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const attrs = eventSegment ? `type="button" data-calendar-day="${day}"` : `type="button" disabled`;
      grid.insertAdjacentHTML("beforeend", `<button class="${classes}" ${attrs}>${day}</button>`);
    }
  }
}

function syncDateSegmentOptions() {
  const year = document.querySelector("[data-date-year]")?.value || "2026";
  const month = document.querySelector("[data-date-month]")?.value || "05";
  const selected = getDateSegment(year, month, 0);
  renderCalendarPicker(0);
  updateDateSegmentResult(selected);
}

function applyDateSegmentFilter(day = 0) {
  const year = document.querySelector("[data-date-year]")?.value || "2026";
  const month = document.querySelector("[data-date-month]")?.value || "05";
  const selected = getDateSegment(year, month, day);
  renderCalendarPicker(day);
  updateDateSegmentResult(selected);
}

function moveCalendarControl(action) {
  const yearSelect = document.querySelector("[data-date-year]");
  const monthSelect = document.querySelector("[data-date-month]");
  if (!yearSelect || !monthSelect) return;

  const years = [...yearSelect.options].map((option) => option.value);
  const months = [...monthSelect.options].map((option) => option.value);
  let yearIndex = years.indexOf(yearSelect.value);
  let monthIndex = months.indexOf(monthSelect.value);

  if (action === "prev-month") monthIndex -= 1;
  if (action === "next-month") monthIndex += 1;
  if (action === "prev-year") yearIndex -= 1;
  if (action === "next-year") yearIndex += 1;

  if (monthIndex < 0) monthIndex = months.length - 1;
  if (monthIndex >= months.length) monthIndex = 0;
  yearIndex = Math.max(0, Math.min(years.length - 1, yearIndex));

  yearSelect.value = years[yearIndex];
  monthSelect.value = months[monthIndex];
  syncDateSegmentOptions();
}

document.addEventListener("click", (event) => {
  if (document.body.classList.contains("event-composition-open")) {
    const insideEventComposition = event.target.closest("[data-event-composition-panel]");
    const opensEventComposition = event.target.closest("[data-open-event-composition]");
    if (!insideEventComposition && !opensEventComposition) {
      closeEventCompositionOverlay();
      return;
    }
  }

  if (document.body.classList.contains("home-composition-open")) {
    const insideComposition = event.target.closest("[data-composition-card]");
    const opensComposition = event.target.closest("[data-home-cluster-event]");
    if (!insideComposition && !opensComposition) {
      closeClusterCupComposition();
      return;
    }
  }

  if (isDesktopSidebarToggleTarget(event)) {
    toggleDesktopSidebar();
    return;
  }

  const cuposAdjustButton = event.target.closest("[data-adjust-cupos]");

  if (cuposAdjustButton) {
    adjustSelectedDateCupos(Number(cuposAdjustButton.dataset.adjustCupos));
    return;
  }

  const dateOption = event.target.closest("[data-date-option]");

  if (dateOption) {
    syncDateDashboard(dateOption);
    return;
  }

  if (event.target.closest("[data-open-composer]")) {
    composerModal?.classList.add("open");
    composerModal?.setAttribute("aria-hidden", "false");
    composerTextarea?.focus();
    updateComposerPublishState();
    renderComposerImagePreview();
    return;
  }

  if (event.target.closest("[data-composer-photo]")) {
    composerFileInput?.click();
    return;
  }

  const composerInsert = event.target.closest("[data-composer-insert]");
  if (composerInsert) {
    insertComposerText(composerInsert.dataset.composerInsert || "");
    return;
  }

  const removeComposerImage = event.target.closest("[data-remove-composer-image]");
  if (removeComposerImage) {
    composerImages.splice(Number(removeComposerImage.dataset.removeComposerImage), 1);
    renderComposerImagePreview();
    updateComposerPublishState();
    return;
  }

  if (event.target.closest("[data-publish-post]")) {
    publishComposerPost();
    return;
  }

  const postInterestButton = event.target.closest("[data-post-interest]");
  if (postInterestButton) {
    togglePostInterest(postInterestButton.closest(".wall-post"));
    return;
  }

  const postCommentButton = event.target.closest("[data-post-comment]");
  if (postCommentButton) {
    postCommentButton.closest(".wall-post")?.classList.toggle("comments-open");
    return;
  }

  const saveCommentButton = event.target.closest("[data-save-comment]");
  if (saveCommentButton) {
    savePostComment(saveCommentButton.closest(".wall-post"));
    return;
  }

  const postShareButton = event.target.closest("[data-post-share]");
  if (postShareButton) {
    sharePostFeedback(postShareButton);
    return;
  }

  const deleteLocalPost = event.target.closest("[data-delete-local-post]");
  if (deleteLocalPost) {
    removeLocalFeedPost(deleteLocalPost.dataset.deleteLocalPost);
    return;
  }

  const feedFilter = event.target.closest("[data-feed-filter]");

  if (feedFilter) {
    document.querySelectorAll("[data-feed-filter]").forEach((filter) => {
      filter.classList.toggle("active", filter === feedFilter);
    });
    applyHomeFeedFilters();
    return;
  }

  const composerCategory = event.target.closest("[data-composer-category]");

  if (composerCategory) {
    document.querySelectorAll("[data-composer-category]").forEach((category) => {
      category.classList.toggle("active", category === composerCategory);
    });
    composerModal.dataset.category = composerCategory.dataset.composerCategory;
    return;
  }

  const homeDateStep = event.target.closest("[data-home-date-step]");
  if (homeDateStep) {
    shiftHomeClusterDate(Number(homeDateStep.dataset.homeDateStep) || 0);
    return;
  }

  const clusterEventFilter = event.target.closest("[data-cluster-event-filter]");

  if (clusterEventFilter) {
    const selectedClusterEventFilter = clusterEventFilter.dataset.clusterEventFilter;
    document.querySelectorAll("[data-cluster-event-filter]").forEach((filter) => {
      filter.classList.toggle("active", filter.dataset.clusterEventFilter === selectedClusterEventFilter);
    });
    applyClusterEventFilter(selectedClusterEventFilter);
    return;
  }

  const homeClusterEvent = event.target.closest("[data-home-cluster-event]");
  if (homeClusterEvent) {
    selectHomeClusterEvent(homeClusterEvent.dataset.homeClusterEvent, { openComposition: true });
    return;
  }

  const internalCuposButton = event.target.closest("[data-cupos-delta]");
  if (internalCuposButton) {
    adjustInternalEventCupos(internalCuposButton);
    return;
  }

  const eventCloseButton = event.target.closest("[data-toggle-event-close]");
  if (eventCloseButton) {
    toggleInternalEventClose(eventCloseButton);
    return;
  }

  const eventCompositionButton = event.target.closest("[data-open-event-composition]");
  if (eventCompositionButton) {
    openEventCompositionOverlay(eventCompositionButton);
    return;
  }

  const externalFilter = event.target.closest("[data-external-request-filter]");
  if (externalFilter) {
    document.querySelectorAll("[data-external-request-filter]").forEach((filter) => {
      filter.classList.toggle("active", filter === externalFilter);
    });
    applyExternalRequestFilter(externalFilter.dataset.externalRequestFilter);
    return;
  }

  const externalCuposButton = event.target.closest("[data-external-cupos-delta]");
  if (externalCuposButton) {
    adjustExternalPendingCupos(externalCuposButton);
    return;
  }

  const myEventFilter = event.target.closest("[data-my-event-filter]");
  if (myEventFilter) {
    document.querySelectorAll("[data-my-event-filter]").forEach((filter) => {
      filter.classList.toggle("active", filter === myEventFilter);
    });
    applyMyEventsFilter(myEventFilter.dataset.myEventFilter);
    closeCalendarPopover();
    return;
  }

  const weekSegment = event.target.closest("[data-week-filter]");
  if (weekSegment) {
    applyWeekSegmentFilter(weekSegment);
    return;
  }

  const calendarDay = event.target.closest("[data-calendar-day]");
  if (calendarDay) {
    applyDateSegmentFilter(Number(calendarDay.dataset.calendarDay) || 0);
    closeCalendarPopover();
    return;
  }

  const calendarNav = event.target.closest("[data-calendar-nav]");
  if (calendarNav) {
    moveCalendarControl(calendarNav.dataset.calendarNav);
    return;
  }

  if (event.target.closest("[data-calendar-toggle]")) {
    toggleCalendarPopover();
    return;
  }

  const printEventButton = event.target.closest("[data-print-event]");
  if (printEventButton) {
    const row = printEventButton.closest("[data-my-event-card]");
    const eventId = row?.dataset.eventDetail || eventFormPanel?.dataset.eventId || "ruta-panoramica";
    printEventReport(eventId, row);
    return;
  }

  const eventDetailRow = event.target.closest("[data-event-detail]");
  if (eventDetailRow && !event.target.closest("button")) {
    renderClusterEventDetail(eventDetailRow.dataset.eventDetail);
    return;
  }

  if (event.target.closest("[data-calendar-all]")) {
    applyDateSegmentFilter(0);
    closeCalendarPopover();
    return;
  }

  if (!event.target.closest("[data-calendar-popover]")) {
    closeCalendarPopover();
  }

  if (event.target.closest("[data-new-date]")) {
    if (eventFormPanel?.classList.contains("new-event-param-mode")) {
      openBlankEventForm();
      return;
    }
    openInheritedDateForm();
    return;
  }

  if (event.target.closest("[data-new-event]")) {
    openBlankEventForm();
    return;
  }

  const paramCalendarDay = event.target.closest("[data-param-calendar-day]");
  if (paramCalendarDay) {
    const date = formatEventDateValue(Number(paramCalendarDay.dataset.paramCalendarDay));
    const selectedDates = getSelectedEventDates();
    const nextDates = selectedDates.includes(date) ? selectedDates.filter((item) => item !== date) : [...selectedDates, date];
    setSelectedEventDates(nextDates);
    const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || getBlankEventDetail();
    renderParamClusterCalendar(detail, true);
    return;
  }

  const dateCard = event.target.closest("[data-param-date-card]");
  if (dateCard) {
    setSelectedEventDates(getSelectedEventDates().filter((date) => date !== dateCard.dataset.paramDateCard));
    const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || getBlankEventDetail();
    renderParamClusterCalendar(detail, true);
    return;
  }

  const calendarStep = event.target.closest("[data-param-calendar-step]");
  if (calendarStep) {
    const nextMonth = paramCalendarState.month + Number(calendarStep.dataset.paramCalendarStep);
    paramCalendarState.year += nextMonth < 0 ? -1 : nextMonth > 11 ? 1 : 0;
    paramCalendarState.month = (nextMonth + 12) % 12;
    const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || getBlankEventDetail();
    renderParamClusterCalendar(detail, true);
    return;
  }

  const reprogramEventButton = event.target.closest("[data-reprogram-event]");
  if (reprogramEventButton) {
    const eventId =
      reprogramEventButton.dataset.eventId ||
      reprogramEventButton.closest("[data-internal-event-row]")?.dataset.eventId ||
      reprogramEventButton.closest("[data-my-event-card]")?.dataset.eventDetail ||
      getSelectedHomeClusterEventId() ||
      "ruta-panoramica";
    openInheritedEventParamForm(eventId);
    return;
  }

  if (event.target.closest("[data-edit-event]")) {
    setEventEditMode(true);
    document.querySelector("[data-event-input-name]")?.focus();
    return;
  }

  if (event.target.closest("[data-save-event]")) {
    applyEventFormInputsToView();
    return;
  }

  if (event.target.closest("[data-save-registration]")) {
    saveRegistrationToBackend();
    return;
  }

  if (event.target.closest("[data-add-cluster-operator]")) {
    const select = document.querySelector("[data-available-operator]");
    const list = document.querySelector("[data-linked-operator-list]");
    const value = select?.value;
    if (value && list && ![...list.querySelectorAll("span")].some((item) => item.dataset.operatorName === value)) {
      const chip = document.createElement("span");
      chip.dataset.operatorName = value;
      chip.innerHTML = `${value} <button type="button" data-remove-linked-operator aria-label="Eliminar ${value}">×</button>`;
      list.appendChild(chip);
      syncAvailableOperators();
    }
    return;
  }

  const removeLinkedOperator = event.target.closest("[data-remove-linked-operator]");
  if (removeLinkedOperator) {
    removeLinkedOperator.closest("span")?.remove();
    syncAvailableOperators();
    return;
  }

  if (event.target.closest("[data-close-composer]")) {
    composerModal?.classList.remove("open");
    composerModal?.setAttribute("aria-hidden", "true");
    return;
  }

  const openEventFormButton = event.target.closest("[data-open-event-form]");
  if (openEventFormButton) {
    const eventId =
      openEventFormButton.dataset.eventId ||
      openEventFormButton.closest("[data-internal-event-row]")?.dataset.eventId ||
      openEventFormButton.closest("[data-my-event-card]")?.dataset.eventDetail ||
      getSelectedHomeClusterEventId() ||
      "ruta-panoramica";
    renderEventOperationDetail(eventId);
    keepEventPanelGlobal();
    eventFormPanel?.classList.remove("minimized", "maximized");
    eventFormPanel?.style.removeProperty("--event-drag-x");
    eventFormPanel?.style.removeProperty("--event-drag-y");
    eventFormPanel?.classList.add("open");
    eventFormPanel?.setAttribute("aria-hidden", "false");
    return;
  }

  if (event.target.closest("[data-close-event-form]")) {
    eventFormPanel?.classList.remove("open");
    eventFormPanel?.classList.remove("minimized", "maximized");
    eventFormPanel?.style.removeProperty("--event-drag-x");
    eventFormPanel?.style.removeProperty("--event-drag-y");
    eventFormPanel?.setAttribute("aria-hidden", "true");
    return;
  }

  if (event.target.closest("[data-minimize-event-form]")) {
    keepEventPanelGlobal();
    eventFormPanel?.classList.toggle("minimized");
    eventFormPanel?.classList.remove("maximized");
    if (eventFormPanel?.classList.contains("minimized")) {
      eventFormPanel.style.setProperty("--event-drag-x", "22px");
      eventFormPanel.style.setProperty("--event-drag-y", "22px");
    }
    return;
  }

  if (event.target.closest("[data-maximize-event-form]")) {
    eventFormPanel?.classList.toggle("maximized");
    eventFormPanel?.classList.remove("minimized");
    eventFormPanel?.style.removeProperty("--event-drag-x");
    eventFormPanel?.style.removeProperty("--event-drag-y");
    return;
  }

  if (event.target.closest("[data-open-payment]")) {
    paymentModal?.classList.add("open");
    paymentModal?.setAttribute("aria-hidden", "false");
    return;
  }

  if (event.target.closest("[data-close-payment]")) {
    paymentModal?.classList.remove("open");
    paymentModal?.setAttribute("aria-hidden", "true");
    return;
  }

  const slotRequestButton = event.target.closest("[data-open-slot-request]");
  if (slotRequestButton) {
    openSlotRequestModal(slotRequestButton);
    return;
  }

  if (event.target.closest("[data-close-slot-request]")) {
    closeSlotRequestModal();
    return;
  }

  const commentToggle =
    event.target.closest(".post-engagement span:last-child") ||
    (event.target.closest(".social-actions button")?.textContent.toLowerCase().includes("comentar")
      ? event.target.closest(".social-actions button")
      : null);

  if (commentToggle) {
    const post = commentToggle.closest(".wall-post");

    if (post?.querySelector(".comment-preview")) {
      post.classList.toggle("comments-open");
    }
  }

  const jumpButton = event.target.closest("[data-jump]");

  if (!jumpButton) {
    return;
  }

  if (!eventFormPanel?.classList.contains("minimized")) {
    eventFormPanel?.classList.remove("open");
    eventFormPanel?.setAttribute("aria-hidden", "true");
  }
  activateView(jumpButton.dataset.jump);
});

document.addEventListener("change", (event) => {
  const composerFile = event.target.closest("[data-composer-file]");
  if (composerFile) {
    const files = Array.from(composerFile.files || []).slice(0, 4 - composerImages.length);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, src: String(reader.result || "") });
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      composerImages = composerImages.concat(images).slice(0, 4);
      composerFile.value = "";
      renderComposerImagePreview();
      updateComposerPublishState();
    });
    return;
  }

  const eventPhotoInput = event.target.closest("[data-event-input-image]");
  if (eventPhotoInput) {
    setEventPhotoFromFile(eventPhotoInput.files?.[0]);
    eventPhotoInput.value = "";
    return;
  }

  if (event.target.closest("[data-internal-date-filter], [data-internal-state-filter]")) {
    applyClusterEventFilter();
  }

  if (event.target.closest("[data-date-year], [data-date-month]")) {
    syncDateSegmentOptions();
  }

  if (event.target.closest("[data-admin-user-type]")) {
    syncAdminRegistrationType();
  }

  if (event.target.closest("[data-event-public-switch]")) {
    const isPublic = event.target.checked;
    const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || eventOperationDetails["nuevo-evento"];
    detail.visibility = isPublic ? "Publico por oferta y demanda" : "Privado del cluster";
    detail.mode = isPublic ? "Publico con comision" : "Privado del cluster";
    updatePublicReplicaState(isPublic);
    setText("[data-event-summary-mode]", detail.mode);
  }

  if (event.target.closest("[data-event-input-visibility]")) {
    const isPublic = event.target.value === "Publico por oferta y demanda";
    const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || eventOperationDetails["nuevo-evento"];
    detail.visibility = event.target.value;
    detail.mode = isPublic ? "Publico con comision" : "Privado del cluster";
    updatePublicReplicaState(isPublic);
    setText("[data-event-summary-mode]", detail.mode);
  }

  if (event.target.closest("[data-param-calendar-month], [data-param-calendar-year]")) {
    const monthSelect = document.querySelector("[data-param-calendar-month]");
    const yearSelect = document.querySelector("[data-param-calendar-year]");
    paramCalendarState.month = Number(monthSelect?.value) || 0;
    paramCalendarState.year = Number(yearSelect?.value) || new Date().getFullYear();
    const detail = eventOperationDetails[eventFormPanel?.dataset.eventId] || getBlankEventDetail();
    renderParamClusterCalendar(detail, true);
  }

  const paymentProof = event.target.closest("[data-payment-proof]");
  if (paymentProof) {
    const proofName = document.querySelector("[data-payment-proof-name]");
    const fileName = paymentProof.files?.[0]?.name;
    if (proofName) proofName.textContent = fileName || "Imagen o PDF del abono bancario";
  }
});

composerTextarea?.addEventListener("input", updateComposerPublishState);

slotRequestForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const countInput = slotRequestForm.querySelector("[data-slot-request-count]");
  const commissionInput = slotRequestForm.querySelector("[data-slot-request-commission]");
  const free = Number(slotRequestModal?.dataset.free) || 0;
  const requested = Math.max(1, Math.min(free || 1, Number(countInput?.value) || 1));

  appendSlotRequest(
    slotRequestModal.dataset.event,
    slotRequestModal.dataset.host,
    requested,
    commissionInput?.value || slotRequestModal.dataset.commission,
    free
  );
  closeSlotRequestModal();
  activateView("requests");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("event-composition-open")) {
    closeEventCompositionOverlay();
  }

  if (event.key === "Escape" && composerModal?.classList.contains("open")) {
    composerModal.classList.remove("open");
    composerModal.setAttribute("aria-hidden", "true");
  }

  if (event.key === "Escape" && eventFormPanel?.classList.contains("open")) {
    eventFormPanel.classList.remove("open");
    eventFormPanel.setAttribute("aria-hidden", "true");
  }

  if (event.key === "Escape" && paymentModal?.classList.contains("open")) {
    paymentModal.classList.remove("open");
    paymentModal.setAttribute("aria-hidden", "true");
  }

  if (event.key === "Escape" && slotRequestModal?.classList.contains("open")) {
    closeSlotRequestModal();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (!eventFormPanel?.classList.contains("minimized")) return;
  const hero = event.target.closest(".event-hero");
  if (!hero || event.target.closest("button, input, select, textarea")) return;

  const rect = hero.getBoundingClientRect();
  minimizedDrag = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  hero.setPointerCapture?.(event.pointerId);
});

document.addEventListener("pointermove", (event) => {
  if (!minimizedDrag || !eventFormPanel?.classList.contains("minimized")) return;
  const width = Math.min(620, window.innerWidth - 32);
  const height = eventFormPanel.querySelector(".event-hero")?.offsetHeight || 180;
  const nextX = Math.max(8, Math.min(window.innerWidth - width - 8, event.clientX - minimizedDrag.offsetX));
  const nextY = Math.max(8, Math.min(window.innerHeight - height - 8, event.clientY - minimizedDrag.offsetY));
  eventFormPanel.style.setProperty("--event-drag-x", `${nextX}px`);
  eventFormPanel.style.setProperty("--event-drag-y", `${nextY}px`);
});

document.addEventListener("pointerup", () => {
  minimizedDrag = null;
});

function buildElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function getLocalFeedPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem(LOCAL_FEED_POSTS_KEY) || "[]");
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

function saveLocalFeedPosts(posts) {
  try {
    localStorage.setItem(LOCAL_FEED_POSTS_KEY, JSON.stringify(posts));
    return true;
  } catch {
    return false;
  }
}

function getComposerCategory() {
  return composerModal?.dataset.category || document.querySelector("[data-composer-category].active")?.dataset.composerCategory || "playa";
}

function getCategoryLabel(category) {
  const labels = {
    playa: "Playa",
    montana: "Montana",
    pueblos: "Pueblos",
    caminatas: "Caminatas",
    lagos: "Lagos",
    gastronomia: "Gastro",
  };
  return labels[category] || "Turismo";
}

function renderComposerImagePreview() {
  if (!composerPreview) return;

  composerPreview.innerHTML = "";
  composerPreview.classList.toggle("has-images", composerImages.length > 0);

  composerImages.forEach((image, index) => {
    const figure = document.createElement("figure");
    const previewImage = document.createElement("img");
    const removeButton = document.createElement("button");

    previewImage.src = image.src;
    previewImage.alt = image.name || `Imagen ${index + 1}`;
    removeButton.type = "button";
    removeButton.dataset.removeComposerImage = String(index);
    removeButton.setAttribute("aria-label", `Quitar ${image.name || `imagen ${index + 1}`}`);
    removeButton.textContent = "×";

    figure.append(previewImage, removeButton);
    composerPreview.appendChild(figure);
  });
}

function updateComposerPublishState() {
  if (!publishPostButton) return;
  const hasText = Boolean(composerTextarea?.value.trim());
  publishPostButton.disabled = !hasText && composerImages.length === 0;
}

function resetComposer() {
  if (composerTextarea) composerTextarea.value = "";
  if (composerFileInput) composerFileInput.value = "";
  composerImages = [];
  renderComposerImagePreview();
  updateComposerPublishState();
}

function insertComposerText(text) {
  if (!composerTextarea) return;
  const start = composerTextarea.selectionStart ?? composerTextarea.value.length;
  const end = composerTextarea.selectionEnd ?? composerTextarea.value.length;
  const before = composerTextarea.value.slice(0, start);
  const after = composerTextarea.value.slice(end);
  composerTextarea.value = `${before}${text}${after}`;
  composerTextarea.focus();
  composerTextarea.setSelectionRange(start + text.length, start + text.length);
  updateComposerPublishState();
}

function buildPostActions(postId = "") {
  const actions = buildElement("div", "post-actions social-actions");
  const buttons = [
    { label: "♡ Me interesa", action: "interest" },
    { label: "◯ Comentar", action: "comment" },
    { label: "↗ Compartir", action: "share" },
  ];

  buttons.forEach((buttonData) => {
    const button = buildElement("button", "", buttonData.label);
    button.type = "button";
    button.dataset[`post${buttonData.action[0].toUpperCase()}${buttonData.action.slice(1)}`] = "true";
    actions.appendChild(button);
  });

  if (postId) {
    const deleteButton = buildElement("button", "", "Eliminar");
    deleteButton.type = "button";
    deleteButton.dataset.deleteLocalPost = postId;
    actions.appendChild(deleteButton);
  }

  return actions;
}

function ensurePostInteractionControls(post) {
  if (!post) return;

  const engagement = post.querySelector(".post-engagement");
  if (engagement?.firstElementChild) {
    engagement.firstElementChild.dataset.interestCount = engagement.firstElementChild.textContent.match(/\d+/)?.[0] || "0";
  }

  const existingActions = post.querySelector(".post-actions");
  if (existingActions && !existingActions.querySelector("[data-post-interest]")) {
    const oldButtons = [...existingActions.querySelectorAll("button")];
    oldButtons[0]?.setAttribute("data-post-interest", "true");
    oldButtons[1]?.setAttribute("data-post-comment", "true");
    oldButtons[2]?.setAttribute("data-post-share", "true");
  }

  if (!post.querySelector(".comment-preview")) {
    const comments = buildElement("div", "comment-preview");
    comments.appendChild(buildElement("strong", "", "Comentarios"));
    post.insertBefore(comments, engagement || existingActions || null);
  }

  if (!post.querySelector(".comment-composer")) {
    const commentComposer = buildElement("div", "comment-composer");
    const input = document.createElement("input");
    const button = buildElement("button", "", "Enviar");
    input.type = "text";
    input.placeholder = "Escribe un comentario";
    button.type = "button";
    button.dataset.saveComment = "true";
    commentComposer.append(input, button);
    post.querySelector(".comment-preview")?.appendChild(commentComposer);
  }
}

function togglePostInterest(post) {
  if (!post) return;
  const button = post.querySelector("[data-post-interest]");
  const counter = post.querySelector(".post-engagement span:first-child");
  const baseCount = Number(counter?.dataset.interestCount || counter?.textContent.match(/\d+/)?.[0] || 0);
  const active = button?.classList.toggle("is-active") || false;
  const nextCount = Math.max(0, baseCount + (active ? 1 : 0));
  if (counter) counter.textContent = `👍 ${nextCount}`;
}

function savePostComment(post) {
  if (!post) return;
  const input = post.querySelector(".comment-composer input");
  const text = input?.value.trim();
  if (!text) return;

  const comment = document.createElement("p");
  comment.innerHTML = `<b>Luis Valladares:</b> ${text}`;
  post.querySelector(".comment-composer")?.insertAdjacentElement("beforebegin", comment);
  if (input) input.value = "";

  const counter = post.querySelector(".post-engagement span:last-child");
  const count = post.querySelectorAll(".comment-preview p").length;
  if (counter) counter.textContent = `${count} comentario${count === 1 ? "" : "s"}`;
}

function sharePostFeedback(button) {
  const originalText = button.textContent;
  button.textContent = "Copiado";
  window.setTimeout(() => {
    button.textContent = originalText;
  }, 1100);
}

function createFeedPostElement(post) {
  const article = buildElement("article", "wall-post local-post");
  const images = Array.isArray(post.images) ? post.images : [];
  article.dataset.category = post.category;
  article.dataset.localPostId = post.id;

  const header = buildElement("div", "post-header");
  const avatar = buildElement("div", "avatar profile-photo", "LV");
  const authorInfo = buildElement("div", "");
  authorInfo.append(buildElement("strong", "", "Luis Valladares"), buildElement("span", "", `Publicacion local · ${getCategoryLabel(post.category)}`));
  header.append(avatar, authorInfo);

  const paragraph = document.createElement("p");
  paragraph.textContent = post.text || "Publicacion con imagenes del operador.";

  const strip = buildElement("div", "potential-strip");
  ["Creado desde HomeFeed", `Categoria: ${getCategoryLabel(post.category)}`, `${images.length} imagen${images.length === 1 ? "" : "es"}`].forEach((tag) => {
    strip.appendChild(buildElement("span", "", tag));
  });

  const engagement = buildElement("div", "post-engagement");
  engagement.append(buildElement("span", "", "👍 0"), buildElement("span", "", "0 comentarios"));

  article.append(header, paragraph);

  if (images.length > 0) {
    const frame = buildElement("figure", "post-photo-grid");
    frame.style.gridTemplateColumns = images.length === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))";
    images.slice(0, 4).forEach((image, index) => {
      const postImage = document.createElement("img");
      postImage.src = image.src;
      postImage.alt = image.name || `Imagen de publicacion ${index + 1}`;
      frame.appendChild(postImage);
    });
    article.appendChild(frame);
  }

  article.append(strip, engagement, buildPostActions(post.id));
  ensurePostInteractionControls(article);
  return article;
}

function renderLocalFeedPosts() {
  const feed = document.querySelector("#home .social-feed");
  const composerCard = feed?.querySelector(".composer-card");
  if (!feed || !composerCard) return;

  feed.querySelectorAll("[data-local-post-id]").forEach((post) => post.remove());

  getLocalFeedPosts()
    .slice()
    .reverse()
    .forEach((post) => {
      composerCard.insertAdjacentElement("afterend", createFeedPostElement(post));
    });
}

function selectFeedCategory(category) {
  document.querySelectorAll("[data-feed-filter]").forEach((filter) => {
    filter.classList.toggle("active", filter.dataset.feedFilter === category);
  });
}

function publishComposerPost() {
  const text = composerTextarea?.value.trim() || "";
  if (!text && composerImages.length === 0) return;

  const post = {
    id: `post-${Date.now()}`,
    text,
    category: getComposerCategory(),
    images: composerImages.slice(0, 4),
    createdAt: new Date().toISOString(),
  };

  const posts = getLocalFeedPosts();
  posts.push(post);
  if (!saveLocalFeedPosts(posts)) {
    alert("La imagen es muy pesada para guardarla en el prototipo local. Prueba con una foto mas liviana.");
    return;
  }
  renderLocalFeedPosts();
  selectFeedCategory(post.category);
  applyHomeFeedFilters();
  resetComposer();
  composerModal?.classList.remove("open");
  composerModal?.setAttribute("aria-hidden", "true");
}

function removeLocalFeedPost(postId) {
  saveLocalFeedPosts(getLocalFeedPosts().filter((post) => post.id !== postId));
  renderLocalFeedPosts();
  applyHomeFeedFilters();
}

function hydrateHomeFeed() {
  const posts = document.querySelectorAll(".wall-post");

  posts.forEach((post, index) => {
    ensurePostInteractionControls(post);

    const data = feedEnhancements[index];

    if (!data) {
      return;
    }

    post.dataset.category = data.category;

    let frame = post.querySelector(".post-photo-grid, .post-photo-frame");

    if (!frame) {
      frame = buildElement("figure", "post-photo-grid");
      const paragraph = post.querySelector("p");
      paragraph?.insertAdjacentElement("afterend", frame);
    }

    frame.className = "post-photo-grid";
    frame.innerHTML = "";
    frame.style.display = "grid";
    frame.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    frame.style.gap = "2px";
    frame.style.width = "100%";
    frame.style.height = "340px";
    frame.style.minHeight = "340px";
    frame.style.margin = "0";
    frame.style.overflow = "hidden";
    frame.style.background = "#dfe5de";

    [data.image, data.image2 || data.image].forEach((src, imageIndex) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = imageIndex === 0 ? data.alt : `${data.alt} detalle`;
      image.loading = "lazy";
      image.style.display = "block";
      image.style.width = "100%";
      image.style.height = "100%";
      image.style.objectFit = "cover";
      image.style.objectPosition = "center";
      frame.appendChild(image);
    });

    if (!post.contains(frame)) {
      post.appendChild(frame);
    }

    if (!post.querySelector(".potential-strip")) {
      const strip = buildElement("div", "potential-strip");
      data.tags.forEach((tag) => strip.appendChild(buildElement("span", "", tag)));
      post.appendChild(strip);
    }

    if (!post.querySelector(".comment-preview") && data.comments.length > 0) {
      const comments = buildElement("div", "comment-preview");
      comments.appendChild(buildElement("strong", "", "Comentarios"));
      data.comments.forEach((comment) => comments.appendChild(buildElement("p", "", comment)));
      post.appendChild(comments);
    }

    if (!post.querySelector(".post-actions")) {
      const actions = buildElement("div", "post-actions");
      ["Me interesa", "Comentar", "Compartir", data.action].forEach((label, actionIndex) => {
        const button = buildElement("button", "", label);
        button.type = "button";

        if (actionIndex === 3 && data.jump) {
          button.dataset.jump = data.jump;
        }

        actions.appendChild(button);
      });
      post.appendChild(actions);
    }
  });
}

function applyHomeFeedFilters() {
  const activeCategory = document.querySelector("[data-feed-filter].active")?.dataset.feedFilter || "todos";

  document.querySelectorAll("#home .wall-post").forEach((post) => {
    const categoryMatches = activeCategory === "todos" || post.dataset.category === activeCategory;
    post.classList.toggle("feed-hidden", !categoryMatches);

    if (categoryMatches) {
      post.style.display = "block";
      post.style.height = "auto";
      post.style.maxHeight = "none";
      post.style.overflow = "hidden";

      post.querySelectorAll(".post-header, p, .post-photo-grid, .post-photo-frame, .potential-strip, .post-engagement, .post-actions").forEach((element) => {
        element.style.height = "";
        element.style.maxHeight = "none";
        element.style.visibility = "visible";
        element.style.opacity = "1";
      });

      const paragraph = post.querySelector("p");
      if (paragraph) paragraph.style.display = "block";

      const photoGrid = post.querySelector(".post-photo-grid");
      if (photoGrid) {
        photoGrid.style.display = "grid";
        photoGrid.style.height = "340px";
        photoGrid.style.minHeight = "340px";
      }

      const potentialStrip = post.querySelector(".potential-strip");
      if (potentialStrip) potentialStrip.style.display = "flex";

      const engagement = post.querySelector(".post-engagement");
      if (engagement) engagement.style.display = "flex";

      const actions = post.querySelector(".post-actions");
      if (actions) actions.style.display = "grid";
    }
  });
}

function applyClusterEventFilter(filterType = "todos") {
  const activeType =
    filterType === "todos" || filterType === "publico" || filterType === "privado"
      ? filterType
      : document.querySelector(".internal-filter-bar [data-cluster-event-filter].active")?.dataset.clusterEventFilter || "todos";
  const selectedDate = document.querySelector("[data-internal-date-filter]")?.value || "todas";
  const selectedState = document.querySelector("[data-internal-state-filter]")?.value || "todos";

  document.querySelectorAll("[data-cluster-event-type]").forEach((eventItem) => {
    const typeMatches = activeType === "todos" || eventItem.dataset.clusterEventType === activeType;
    const stateMatches =
      selectedState === "todos" || eventItem.dataset.eventState === selectedState || !eventItem.matches("[data-internal-event-row]");
    const dateMatches =
      selectedDate === "todas" || eventItem.dataset.eventDate === selectedDate || !eventItem.matches("[data-internal-event-row]");
    const isVisible = typeMatches && dateMatches && stateMatches;
    eventItem.classList.toggle("is-hidden", !isVisible);
  });

  updateInternalRanking();
}

function parseISODateValue(value) {
  if (!value) return new Date(0);
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

function formatShortDate(value) {
  const date = parseISODateValue(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function getHomeClusterEventRows() {
  return getInternalEventRows()
    .map((row) => ({
      id: row.dataset.eventId,
      date: row.dataset.eventDate,
      title: row.querySelector("td strong")?.textContent?.trim() || "Evento",
    }))
    .filter((event) => event.id && event.date);
}

function getHomeClusterDates() {
  return [...new Set(getHomeClusterEventRows().map((event) => event.date))].sort(
    (left, right) => parseISODateValue(right) - parseISODateValue(left)
  );
}

function renderHomeClusterDateRail(preferredDate) {
  const rail = document.querySelector("[data-home-date-rail]");
  if (!rail) return;

  const events = getHomeClusterEventRows();
  const dates = getHomeClusterDates();
  const activeDate = dates.includes(preferredDate) ? preferredDate : dates[0];
  const activeIndex = Math.max(0, dates.indexOf(activeDate));
  const total = events.filter((event) => event.date === activeDate).length;
  const label = total === 1 ? "1 evento" : `${total} eventos`;

  rail.dataset.homeActiveDate = activeDate || "";
  rail.dataset.homeActiveIndex = String(activeIndex);

  if (!activeDate) {
    rail.innerHTML = `
      <div class="home-date-card empty" aria-live="polite">
        <span>Fecha activa</span>
        <strong>--/--/--</strong>
        <small>0 eventos</small>
      </div>
    `;
    return;
  }

  rail.innerHTML = `
    <button class="home-date-step" type="button" data-home-date-step="-1" aria-label="Ir a fecha mas reciente" ${activeIndex <= 0 ? "disabled" : ""}>‹</button>
    <div class="home-date-card" aria-live="polite">
      <span>Fecha activa</span>
      <strong>${formatShortDate(activeDate)}</strong>
      <small>${label}</small>
    </div>
    <button class="home-date-step" type="button" data-home-date-step="1" aria-label="Fecha anterior" ${activeIndex >= dates.length - 1 ? "disabled" : ""}>›</button>
  `;

  applyHomeClusterDateFilter(activeDate);
}

function shiftHomeClusterDate(direction) {
  const dates = getHomeClusterDates();
  if (!dates.length) return;

  closeClusterCupComposition();
  const rail = document.querySelector("[data-home-date-rail]");
  const activeDate = rail?.dataset.homeActiveDate || dates[0];
  const currentIndex = Math.max(0, dates.indexOf(activeDate));
  const nextIndex = Math.max(0, Math.min(dates.length - 1, currentIndex + direction));
  renderHomeClusterDateRail(dates[nextIndex]);
}

function applyHomeClusterDateFilter(date) {
  const events = getHomeClusterEventRows();
  const dates = getHomeClusterDates();
  const activeDate = dates.includes(date) ? date : dates[0];
  if (!activeDate) return;

  const rail = document.querySelector("[data-home-date-rail]");
  if (rail) {
    rail.dataset.homeActiveDate = activeDate;
    rail.dataset.homeActiveIndex = String(Math.max(0, dates.indexOf(activeDate)));
  }

  const activeLabel = document.querySelector("[data-home-date-current]");
  const eventsInDate = events.filter((event) => event.date === activeDate);
  if (activeLabel) {
    const label = eventsInDate.length === 1 ? "1 evento" : `${eventsInDate.length} eventos`;
    activeLabel.textContent = `${formatShortDate(activeDate)} · ${label}`;
  }

  document.querySelectorAll("[data-home-cluster-event]").forEach((card) => {
    const row = document.querySelector(`[data-internal-event-row][data-event-id="${card.dataset.homeClusterEvent}"]`);
    const isVisible = row?.dataset.eventDate === activeDate;
    card.classList.toggle("is-hidden", !isVisible);
  });

  const visibleActive = document.querySelector("[data-home-cluster-event].active:not(.is-hidden)");
  const firstVisible = document.querySelector("[data-home-cluster-event]:not(.is-hidden)");
  if (!visibleActive && firstVisible) selectHomeClusterEvent(firstVisible.dataset.homeClusterEvent);
}

function applyExternalRequestFilter(filterType = "aprobadas") {
  let visibleRows = 0;
  const counts = {
    aprobadas: 0,
    pendientes: 0,
    todas: 0,
    riesgo: 0,
  };

  document.querySelectorAll("[data-external-request-row]").forEach((row) => {
    syncExternalRequestRisk(row);
    const pending = Number(row.dataset.externalPending) || 0;
    const status = row.dataset.externalRequestStatus;
    const isRisk = row.dataset.externalRisk === "true";
    counts.todas += 1;
    if (counts[status] !== undefined) counts[status] += 1;
    if (isRisk) counts.riesgo += pending;

    const isVisible =
      filterType === "todas" ||
      status === filterType ||
      (filterType === "riesgo" && isRisk);

    row.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleRows += 1;
  });

  document.querySelectorAll("[data-external-request-filter]").forEach((filter) => {
    const badge = filter.querySelector("b");
    if (!badge) return;
    badge.textContent = counts[filter.dataset.externalRequestFilter] ?? 0;
  });

  const emptyState = document.querySelector("[data-external-empty-state]");
  if (emptyState) emptyState.classList.toggle("show", visibleRows === 0);
}

function syncExternalRequestRisk(row) {
  const pending = Number(row.dataset.externalPending) || 0;
  const free = Number(row.dataset.externalFree) || 0;
  const isRisk = pending > free && pending > 0;
  const capacityCell = row.querySelector(".capacity-cell");
  const pendingCount = row.querySelector("[data-external-pending-count]");
  const pendingLabel = row.querySelector("[data-external-pending-label]");
  const stateLabel = row.querySelector("[data-external-state-label]");

  row.dataset.externalRisk = isRisk ? "true" : "false";
  if (row.dataset.externalPending !== undefined) {
    row.dataset.externalRequestStatus = pending > 0 ? "pendientes" : "aprobadas";
  }
  capacityCell?.classList.toggle("risk", isRisk);

  if (pendingCount) pendingCount.textContent = pending;
  if (pendingLabel) {
    pendingLabel.textContent = pending === 1 ? "1 pendiente por confirmar" : `${pending} pendientes por confirmar`;
    pendingLabel.classList.toggle("risk", isRisk);
  }

  let riskBadge = capacityCell?.querySelector("em");
  if (isRisk && capacityCell && !riskBadge) {
    riskBadge = document.createElement("em");
    capacityCell.appendChild(riskBadge);
  }
  if (riskBadge) {
    riskBadge.textContent = isRisk ? `Riesgo: ${pending} pendientes` : "";
    riskBadge.style.display = isRisk ? "" : "none";
  }

  if (stateLabel) {
    const isPending = pending > 0;
    stateLabel.textContent = isPending ? "Pendiente" : "Aprobado";
    stateLabel.classList.toggle("pending", isPending);
    stateLabel.classList.toggle("approved", !isPending);
  }
}

function adjustExternalPendingCupos(button) {
  const row = button.closest("[data-external-request-row]");
  if (!row) return;

  const delta = Number(button.dataset.externalCuposDelta) || 0;
  const currentPending = Number(row.dataset.externalPending) || 0;
  row.dataset.externalPending = String(Math.max(0, currentPending + delta));
  syncExternalRequestRisk(row);
  applyExternalRequestFilter(
    document.querySelector("[data-external-request-filter].active")?.dataset.externalRequestFilter || "aprobadas"
  );
}

function getSelectedHomeClusterEventId() {
  return (
    document.querySelector("[data-home-cluster-event].active")?.dataset.homeClusterEvent ||
    document.querySelector("[data-home-cluster-event]")?.dataset.homeClusterEvent
  );
}

function selectHomeClusterEvent(eventId, options = {}) {
  document.querySelectorAll("[data-home-cluster-event]").forEach((eventItem) => {
    eventItem.classList.toggle("active", eventItem.dataset.homeClusterEvent === eventId);
  });
  renderClusterCupComposition(eventId);
  if (options.openComposition) openClusterCupComposition();
}

function openClusterCupComposition() {
  const compositionCard = document.querySelector("[data-composition-card]");
  if (!compositionCard) return;
  document.body.classList.add("home-composition-open");
  compositionCard.setAttribute("aria-hidden", "false");
}

function closeClusterCupComposition() {
  const compositionCard = document.querySelector("[data-composition-card]");
  document.body.classList.remove("home-composition-open");
  compositionCard?.setAttribute("aria-hidden", "true");
}

function ensureEventCompositionOverlay() {
  let overlay = document.querySelector("[data-event-composition-overlay]");
  if (overlay) return overlay;

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="event-composition-overlay" data-event-composition-overlay aria-hidden="true">
      <div class="event-composition-frost" data-event-composition-close></div>
      <section class="event-composition-panel" data-event-composition-panel role="dialog" aria-modal="true" aria-label="Composicion de cupos">
        <div class="event-composition-heading">
          <span>Composicion de cupos</span>
          <strong data-event-composition-title>Evento seleccionado</strong>
        </div>
        <div class="event-composition-summary">
          <strong data-event-composition-total>0/0</strong>
          <span data-event-composition-free>0 cupos disponibles</span>
        </div>
        <div class="event-composition-bars" data-event-composition-bars></div>
      </section>
    </div>`
  );

  return document.querySelector("[data-event-composition-overlay]");
}

function getCompositionFromInternalRow(row) {
  const eventId = row?.dataset.eventId;
  const total = Number(row?.dataset.total) || 0;
  const filled = Number(row?.dataset.filled) || 0;
  const myCupos = Number(row?.dataset.myCupos) || 0;
  const others = (clusterCupComposition[eventId] || [])
    .filter((item) => !item.isMe)
    .map((item) => ({ ...item, count: Number(item.count) || 0 }));
  const otherSum = others.reduce((sum, item) => sum + item.count, 0);
  const expectedOtherSum = Math.max(0, filled - myCupos);

  if (others.length && otherSum !== expectedOtherSum) {
    others[others.length - 1].count = Math.max(0, others[others.length - 1].count + expectedOtherSum - otherSum);
  } else if (!others.length && expectedOtherSum) {
    others.push({ name: "Operadores vinculados", count: expectedOtherSum });
  }

  return [{ name: "Luis Valladares", count: myCupos, isMe: true }, ...others].filter((item) => item.count > 0 || item.isMe);
}

function renderEventCompositionOverlay(row) {
  const overlay = ensureEventCompositionOverlay();
  const barsContainer = overlay?.querySelector("[data-event-composition-bars]");
  if (!overlay || !row || !barsContainer) return;

  const title = row.querySelector("td strong")?.textContent?.trim() || "Evento seleccionado";
  const total = Number(row.dataset.total) || 0;
  const filled = Number(row.dataset.filled) || 0;
  const free = Math.max(0, total - filled);
  const composition = getCompositionFromInternalRow(row);

  overlay.querySelector("[data-event-composition-title]").textContent = title;
  overlay.querySelector("[data-event-composition-total]").textContent = `${filled}/${total}`;
  overlay.querySelector("[data-event-composition-free]").textContent = `${free} cupos disponibles`;
  barsContainer.innerHTML = composition
    .map((item) => {
      const width = total ? Math.max(3, Math.min(100, (item.count / total) * 100)) : 0;
      return `<div class="event-composition-row${item.isMe ? " is-me" : ""}">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${item.count}/${total} cupos</span>
        </div>
        <div class="event-composition-track"><b style="width: ${width}%"></b></div>
      </div>`;
    })
    .join("");
}

function openEventCompositionOverlay(trigger) {
  const row = trigger?.closest?.("[data-internal-event-row]") || trigger;
  if (!row) return;

  const overlay = ensureEventCompositionOverlay();
  renderEventCompositionOverlay(row);
  document.body.classList.add("event-composition-open");
  overlay?.setAttribute("aria-hidden", "false");
}

function closeEventCompositionOverlay() {
  const overlay = document.querySelector("[data-event-composition-overlay]");
  document.body.classList.remove("event-composition-open");
  overlay?.setAttribute("aria-hidden", "true");
}

function renderClusterCupComposition(eventId = getSelectedHomeClusterEventId()) {
  const selectedRow = document.querySelector(`[data-internal-event-row][data-event-id="${eventId}"]`);
  const selectedCard = document.querySelector(`[data-home-cluster-event="${eventId}"]`);
  const barsContainer = document.querySelector("[data-composition-bars]");
  if (!selectedRow || !selectedCard || !barsContainer) return;

  const title = selectedCard.querySelector("strong")?.textContent || "Evento seleccionado";
  const total = Number(selectedRow.dataset.total) || 0;
  const filled = Number(selectedRow.dataset.filled) || 0;
  const myCupos = Number(selectedRow.dataset.myCupos) || 0;
  const free = Math.max(0, total - filled);
  const baseComposition = clusterCupComposition[eventId] || [];
  const others = baseComposition
    .filter((item) => !item.isMe)
    .map((item) => ({ ...item }));
  const otherSum = others.reduce((sum, item) => sum + item.count, 0);
  const expectedOtherSum = Math.max(0, filled - myCupos);

  if (others.length && otherSum !== expectedOtherSum) {
    others[others.length - 1].count = Math.max(0, others[others.length - 1].count + expectedOtherSum - otherSum);
  }

  const composition = [{ name: "Luis Valladares", count: myCupos, isMe: true }, ...others];

  document.querySelector("[data-composition-title]").textContent = title;
  document.querySelector("[data-composition-total]").textContent = `${filled}/${total}`;
  document.querySelector("[data-composition-free]").textContent = `${free} cupos disponibles`;
  barsContainer.innerHTML = composition
    .map((item) => {
      const width = total ? Math.max(3, Math.min(100, (item.count / total) * 100)) : 0;
      return `<div class="composition-row${item.isMe ? " is-me" : ""}">
        <div><strong>${item.name}</strong><span>${item.count}/${total} cupos</span></div>
        <div class="composition-track"><b style="width: ${width}%"></b></div>
      </div>`;
    })
    .join("");
}

function getInternalEventRows() {
  return [...document.querySelectorAll("[data-internal-event-row]")];
}

function refreshInternalFilterCounts() {
  const rows = getInternalEventRows();
  const counts = rows.reduce(
    (acc, row) => {
      acc.todos += 1;
      acc[row.dataset.clusterEventType] = (acc[row.dataset.clusterEventType] || 0) + 1;
      return acc;
    },
    { todos: 0, publico: 0, privado: 0 }
  );

  Object.entries(counts).forEach(([key, value]) => {
    const counter = document.querySelector(`[data-internal-filter-count="${key}"]`);
    if (counter) counter.textContent = value;
  });
}

function updateInternalRanking() {
  let totalFilled = 0;
  let totalCapacity = 0;
  const activeInternalFilter =
    document.querySelector(".internal-filter-bar [data-cluster-event-filter].active")?.dataset.clusterEventFilter ||
    "todos";
  const selectedDate = document.querySelector("[data-internal-date-filter]")?.value || "todas";
  const selectedState = document.querySelector("[data-internal-state-filter]")?.value || "todos";

  getInternalEventRows().forEach((row) => {
    const filled = Number(row.dataset.filled) || 0;
    const total = Number(row.dataset.total) || 0;
    const percent = total ? Math.round((filled / total) * 100) : 0;
    const typeMatches = activeInternalFilter === "todos" || row.dataset.clusterEventType === activeInternalFilter;
    const dateMatches = selectedDate === "todas" || row.dataset.eventDate === selectedDate;
    const stateMatches = selectedState === "todos" || row.dataset.eventState === selectedState;
    const isVisibleInRanking = typeMatches && dateMatches && stateMatches;

    if (isVisibleInRanking) {
      totalFilled += filled;
      totalCapacity += total;
    }

    const filledCell = row.querySelector("[data-filled-cupos]");
    if (filledCell) filledCell.textContent = `${filled}/${total}`;

    const myCupos = row.querySelector("[data-my-cupos]");
    if (myCupos) myCupos.textContent = Number(row.dataset.myCupos) || 0;

    syncInternalEventState(row);

    const homeClusterEvent = document.querySelector(`[data-home-cluster-event="${row.dataset.eventId}"]`);
    const homeClusterCupos = homeClusterEvent?.querySelector("[data-home-cluster-cupos]");
    if (homeClusterCupos) homeClusterCupos.textContent = `${Number(row.dataset.myCupos) || 0}, ${filled}/${total}`;

    if (eventFormPanel?.dataset.eventId === row.dataset.eventId) {
      setText("[data-event-fill-percent]", `${percent}%`);
    }

    const ranking = document.querySelector(`[data-ranking-event="${row.dataset.eventId}"]`);
    if (!ranking) return;

    ranking.classList.toggle("is-hidden", !isVisibleInRanking);

    const rankingCupos = ranking.querySelector("[data-ranking-cupos]");
    const rankingPercent = ranking.querySelector("[data-ranking-percent]");
    const rankingBar = ranking.querySelector("[data-ranking-bar]");
    if (rankingCupos) rankingCupos.textContent = `${filled}/${total} cupos llenos`;
    if (rankingPercent) rankingPercent.textContent = `${percent}%`;
    if (rankingBar) rankingBar.style.width = `${Math.min(percent, 100)}%`;
  });

  const rankingTotal = document.querySelector("[data-ranking-total]");
  if (rankingTotal) rankingTotal.textContent = `${totalFilled}/${totalCapacity} cupos`;
  const activeHomeDate = document.querySelector("[data-home-date-rail]")?.dataset.homeActiveDate;
  if (activeHomeDate) applyHomeClusterDateFilter(activeHomeDate);
  renderClusterCupComposition();
}

function syncInternalEventState(row) {
  const isClosed = row.dataset.eventState === "cerrado";
  const status = row.querySelector("[data-event-status]");
  const toggleButton = row.querySelector("[data-toggle-event-close]");

  row.querySelectorAll("[data-cupos-delta]").forEach((button) => {
    button.disabled = isClosed;
  });

  if (status) {
    status.textContent = isClosed ? "Cerrado" : "Vigente";
    status.classList.toggle("closed", isClosed);
    status.classList.toggle("active", !isClosed);
  }

  if (toggleButton) {
    toggleButton.classList.toggle("is-closed", isClosed);
    toggleButton.textContent = isClosed ? "↺" : "!";
    toggleButton.title = isClosed ? "Revertir cierre" : "Cerrar evento";
    toggleButton.setAttribute("aria-label", isClosed ? "Revertir cierre" : "Cerrar evento");
  }
}

function toggleInternalEventClose(button) {
  const row = button.closest("[data-internal-event-row]");
  if (!row) return;

  row.dataset.eventState = row.dataset.eventState === "cerrado" ? "vigente" : "cerrado";
  syncInternalEventState(row);
  applyClusterEventFilter();
}

function adjustInternalEventCupos(button) {
  const row = button.closest("[data-internal-event-row]");
  if (!row) return;
  if (row.dataset.eventState === "cerrado") return;

  const delta = Number(button.dataset.cuposDelta) || 0;
  const total = Number(row.dataset.total) || 0;
  const currentMine = Number(row.dataset.myCupos) || 0;
  const currentFilled = Number(row.dataset.filled) || 0;

  if (delta < 0 && currentMine <= 0) return;
  if (delta > 0 && currentFilled >= total) return;

  row.dataset.myCupos = String(Math.max(0, currentMine + delta));
  row.dataset.filled = String(Math.max(0, Math.min(total, currentFilled + delta)));
  updateInternalRanking();
}

hydrateHomeFeed();
renderLocalFeedPosts();
hydrateResponsiveTables();
applyHomeFeedFilters();
applyClusterEventFilter();
applyExternalRequestFilter();
refreshInternalFilterCounts();
updateInternalRanking();
renderHomeClusterDateRail();
renderClusterCupComposition();
syncDateSegmentOptions();
renderClusterEventDetail();
syncAdminRegistrationType();
syncAvailableOperators();
connectBackend();
