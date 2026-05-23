const canvas = document.getElementById("networkCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const brandTeal = "#0aa5ad";
const brandTealSoft = "rgba(10, 165, 173, 0.34)";
const brandTealStroke = "rgba(10, 165, 173, 0.84)";
const actorContent = {
  operadores: {
    label: "Tour operadores y clusters",
    strategy: "El centro operativo donde nacen, se administran y se liquidan las experiencias.",
    title: "Controlan eventos, cupos, ventas, aliados y liquidaciones desde un sistema común.",
    copy:
      "Tecaigo les da administración operativa, distribución colaborativa, control financiero y datos para tomar mejores decisiones.",
    image: "assets/tecaigo-guides-cluster.png",
    imageAlt: "Grupo de guías y operadores turísticos conectados por Tecaigo",
    fit: "cover",
  },
  comercios: {
    label: "Comercios y proveedores",
    strategy: "La oferta local deja de estar aislada y entra en rutas que ya tienen demanda.",
    title: "Conectan productos, servicios y experiencias con operadores que mueven viajeros.",
    copy:
      "Restaurantes, hostales, destinos, guías y proveedores pueden recibir visibilidad, alianzas y ventas dentro del flujo turístico.",
    image: "assets/tecaigo-restaurant-owner.png",
    imageAlt: "Comercio turístico aliado a Tecaigo",
    fit: "cover",
  },
  transporte: {
    label: "Transportistas",
    strategy: "La movilidad se vuelve parte de la experiencia, no una coordinación improvisada.",
    title: "Ordenan rutas, capacidad, puntos de salida y responsables para mover grupos con control.",
    copy:
      "La plataforma conecta disponibilidad, ubicación, eventos y ocupación para reducir fricción logística.",
    image: "assets/tecaigo-transport-microbus.png",
    imageAlt: "Transporte turístico conectado a Tecaigo",
    fit: "cover",
  },
  viajeros: {
    label: "Viajeros",
    strategy: "La demanda encuentra experiencias confiables, visibles y listas para reservar.",
    title: "Descubren rutas, compran cupos y participan en una comunidad turística conectada.",
    copy:
      "Tecaigo facilita reservas, recomendaciones, contenido y experiencias personalizadas para turismo interno y regional.",
    image: "assets/tecaigo-tourist-beach.png",
    imageAlt: "Viajera explorando una experiencia turística",
    fit: "cover",
  },
  instituciones: {
    label: "Instituciones",
    strategy: "La red genera datos, formación y trazabilidad para fortalecer economías locales.",
    title: "Acompañan formalización, talento, financiamiento y decisiones con información real.",
    copy:
      "La red abre espacio para capacitación, inserción laboral, datos sectoriales, inclusión financiera y políticas de turismo sostenible.",
    image: "assets/tecaigo-university-classroom.png",
    imageAlt: "Instituciones formando talento turístico",
    fit: "cover",
  },
};

const nodes = [
  { x: 0.64, y: 0.31, r: 5, label: "Tour operadores", labelY: -34 },
  { x: 0.78, y: 0.23, r: 4, label: "Clusters", labelY: -34 },
  { x: 0.91, y: 0.39, r: 5, label: "Transporte", labelY: -34 },
  { x: 0.88, y: 0.58, r: 4, label: "Comercios", labelY: 34 },
  { x: 0.78, y: 0.71, r: 6, label: "Turistas", labelY: 36 },
  { x: 0.59, y: 0.49, r: 4, label: "Instituciones", labelY: 36 },
  { x: 0.76, y: 0.49, r: 10, label: "Tecaigo", labelY: -40 },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
];

let width = 0;
let height = 0;
let frame = 0;
let pointer = { x: 0.5, y: 0.5 };
let activeNetworkLabel = "Tour operadores";

function resize() {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function position(node, index) {
  const pulse = Math.sin(frame * 0.012 + index) * 8;
  const influenceX = (pointer.x - 0.5) * 10;
  const influenceY = (pointer.y - 0.5) * 10;
  return {
    x: node.x * width + pulse + influenceX,
    y: node.y * height + Math.cos(frame * 0.01 + index) * 8 + influenceY,
  };
}

function draw() {
  if (!ctx) return;
  frame += 1;
  ctx.clearRect(0, 0, width, height);

  const points = nodes.map(position);

  const core = points[6];
  if (core) {
    const glow = ctx.createRadialGradient(core.x, core.y, 20, core.x, core.y, Math.min(width, height) * 0.34);
    glow.addColorStop(0, "rgba(10, 165, 173, 0.38)");
    glow.addColorStop(0.48, "rgba(10, 165, 173, 0.16)");
    glow.addColorStop(1, "rgba(10, 165, 173, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(core.x, core.y, Math.min(width, height) * 0.34, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = 1.45;
  links.forEach(([a, b], index) => {
    const start = points[a];
    const end = points[b];
    const alpha = 0.52 + Math.sin(frame * 0.018 + index) * 0.1;
    ctx.strokeStyle = `rgba(10, 165, 173, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });

  points.forEach((point, index) => {
    const node = nodes[index];
    const isCore = node.label === "Tecaigo";
    const isHighlighted = node.label === activeNetworkLabel;
    ctx.beginPath();
    ctx.arc(point.x, point.y, node.r + (isCore ? 6 : isHighlighted ? 8 : 2), 0, Math.PI * 2);
    ctx.fillStyle = isCore
      ? brandTealSoft
      : isHighlighted
        ? "rgba(10, 165, 173, 0.34)"
        : "rgba(10, 165, 173, 0.22)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(point.x, point.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = isCore || isHighlighted ? brandTeal : "rgba(255, 253, 247, 0.94)";
    ctx.fill();

    const labelY = point.y + node.labelY;
    ctx.font = `${isCore || isHighlighted ? 800 : 700} ${isCore || isHighlighted ? 15 : 13}px Inter, system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const textWidth = ctx.measureText(node.label).width;
    const paddingX = 9;
    const paddingY = 6;
    const labelX = point.x;

    ctx.fillStyle = isCore || isHighlighted ? "rgba(10, 165, 173, 0.34)" : "rgba(6, 18, 17, 0.46)";
    ctx.strokeStyle = isCore || isHighlighted ? brandTealStroke : "rgba(10, 165, 173, 0.48)";
    ctx.lineWidth = isHighlighted ? 1.6 : 1;
    ctx.beginPath();
    ctx.roundRect(labelX - textWidth / 2 - paddingX, labelY - 10 - paddingY / 2, textWidth + paddingX * 2, 20 + paddingY, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isCore || isHighlighted ? "rgba(10, 210, 220, 1)" : "rgba(255, 253, 247, 0.96)";
    ctx.fillText(node.label, labelX, labelY);
    ctx.textAlign = "start";
  });

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer = {
    x: event.clientX / Math.max(window.innerWidth, 1),
    y: event.clientY / Math.max(window.innerHeight, 1),
  };
});

if (canvas && ctx) {
  resize();
  draw();
}

const actorTabs = [...document.querySelectorAll(".actor-tab")];
const actorKeys = actorTabs.map((tab) => tab.dataset.actor).filter(Boolean);
const actorMobileQuery = window.matchMedia("(max-width: 620px)");
let actorCarouselTimer;
let activeActorIndex = Math.max(
  0,
  actorKeys.findIndex((key) => document.querySelector(`.actor-tab[data-actor="${key}"]`)?.classList.contains("active")),
);

function setActor(actorKey, animate = true) {
  const actor = actorContent[actorKey];
  const card = document.getElementById("actorCard");
  if (!actor || !card) return;

  activeActorIndex = Math.max(0, actorKeys.indexOf(actorKey));
  actorTabs.forEach((item) => item.classList.toggle("active", item.dataset.actor === actorKey));

  if (animate) {
    card.animate(
      [
        { opacity: 0.55, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 220, easing: "ease-out" },
    );
  }

  card.classList.toggle("has-visual", Boolean(actor.image));
  card.classList.toggle("fit-cover", actor.fit === "cover");
  card.innerHTML = actor.image
    ? `
      <div class="actor-strategy">
        <span>${actor.label}</span>
        <p>${actor.strategy}</p>
      </div>
      <div class="actor-visual-frame">
        <img class="actor-visual" src="${actor.image}" alt="${actor.imageAlt}" />
      </div>
      <div class="actor-visual-caption">
        <span class="actor-label">${actor.label}</span>
        <h3>${actor.title}</h3>
      </div>
    `
    : `
      <span class="actor-label">${actor.label}</span>
      <h3>${actor.title}</h3>
      <p>${actor.copy}</p>
    `;
}

function startActorCarousel() {
  window.clearInterval(actorCarouselTimer);
  if (actorKeys.length < 2) return;

  actorCarouselTimer = window.setInterval(() => {
    activeActorIndex = (activeActorIndex + 1) % actorKeys.length;
    setActor(actorKeys[activeActorIndex]);
  }, 7000);
}

actorTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActor(tab.dataset.actor);
    startActorCarousel();
  });
});

actorMobileQuery.addEventListener("change", startActorCarousel);
startActorCarousel();

const heroBackgroundSlides = [...document.querySelectorAll(".hero-background-carousel img")];
let heroBackgroundIndex = 0;
if (heroBackgroundSlides[0]?.dataset.highlight) {
  activeNetworkLabel = heroBackgroundSlides[0].dataset.highlight;
}

if (heroBackgroundSlides.length > 1) {
  window.setInterval(() => {
    heroBackgroundIndex = (heroBackgroundIndex + 1) % heroBackgroundSlides.length;
    heroBackgroundSlides.forEach((slide, index) => {
      slide.classList.toggle("active", index === heroBackgroundIndex);
    });
    activeNetworkLabel = heroBackgroundSlides[heroBackgroundIndex].dataset.highlight || "Tecaigo";
  }, 5600);
}

const rotatingWord = document.querySelector(".rotating-word");
const rotatingWords = [
  "conectada.",
  "colaborativa.",
  "digital.",
  "sostenible.",
  "turística.",
  "transparente.",
  "dinámica.",
  "inclusiva.",
  "cultural.",
];

if (rotatingWord) {
  let wordIndex = 0;
  let characterIndex = rotatingWords[0].length;
  let deleting = true;

  function typeEconomyWord() {
    const word = rotatingWords[wordIndex];
    let delay = deleting ? 58 : 84;

    if (deleting) {
      characterIndex -= 1;
      rotatingWord.textContent = word.slice(0, Math.max(characterIndex, 0));

      if (characterIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % rotatingWords.length;
        delay = 180;
      }
    } else {
      const nextWord = rotatingWords[wordIndex];
      characterIndex += 1;
      rotatingWord.textContent = nextWord.slice(0, characterIndex);

      if (characterIndex >= nextWord.length) {
        deleting = true;
        delay = 1450;
      }
    }

    window.setTimeout(typeEconomyWord, delay);
  }

  window.setTimeout(typeEconomyWord, 1400);
}

const reelRotatingWord = document.querySelector(".reel-rotating-word");
const reelRotatingWords = [
  "cupos controlados.",
  "eventos públicos.",
  "solicitudes trazables.",
  "rutas visibles.",
  "ventas coordinadas.",
  "operación medible.",
];

if (reelRotatingWord) {
  let reelWordIndex = 0;
  let reelCharacterIndex = reelRotatingWords[0].length;
  let reelDeleting = true;

  function typeReelWord() {
    const word = reelRotatingWords[reelWordIndex];
    let delay = reelDeleting ? 48 : 74;

    if (reelDeleting) {
      reelCharacterIndex -= 1;
      reelRotatingWord.textContent = word.slice(0, Math.max(reelCharacterIndex, 0));

      if (reelCharacterIndex <= 0) {
        reelDeleting = false;
        reelWordIndex = (reelWordIndex + 1) % reelRotatingWords.length;
        delay = 160;
      }
    } else {
      const nextWord = reelRotatingWords[reelWordIndex];
      reelCharacterIndex += 1;
      reelRotatingWord.textContent = nextWord.slice(0, reelCharacterIndex);

      if (reelCharacterIndex >= nextWord.length) {
        reelDeleting = true;
        delay = 1350;
      }
    }

    window.setTimeout(typeReelWord, delay);
  }

  window.setTimeout(typeReelWord, 1200);
}

const definitionCards = [...document.querySelectorAll(".definition-panel article")];
const introBand = document.querySelector(".intro-band");
const introQuestionText = document.getElementById("introQuestionText");
const introSteps = [...document.querySelectorAll(".intro-stepper button")];
let definitionStarted = false;
let definitionIndex = 0;
let definitionTimer = null;
let definitionToken = 0;
const definitionReadDelay = 30000;

const definitionPairs = definitionCards.map((card) => ({
  card,
  copy: card.querySelector("p"),
  question: card.dataset.question || "",
  answer: card.querySelector("p")?.textContent.replace(/\s+/g, " ").trim() || "",
}));

definitionPairs.forEach(({ card, copy }) => {
  card.classList.remove("active");
  if (copy) copy.textContent = "";
});

function renderIntroQuestion(question) {
  if (!introQuestionText) return;

  if (question.includes("Tecaigo")) {
    introQuestionText.innerHTML = `
      <span>Qué es</span>
      <span class="intro-wordmark" aria-label="Tecaigo">
        <span class="wordmark-white">TeCai</span><span class="wordmark-go">GO</span>
      </span>
      <span>?</span>
    `;
    return;
  }

  introQuestionText.textContent = question;
}

if (introQuestionText && definitionPairs[0]) {
  renderIntroQuestion(definitionPairs[0].question);
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function typeDefinitionWords(copy, answer) {
  copy.textContent = answer;
}

async function showDefinitionStep(pairIndex, shouldContinue = true) {
  if (definitionPairs.length === 0) return;

  const token = (definitionToken += 1);
  const pair = definitionPairs[pairIndex];
  definitionIndex = pairIndex;
  window.clearTimeout(definitionTimer);

  definitionPairs.forEach(({ card, copy }) => {
    card.classList.remove("active");
    if (copy) copy.textContent = "";
  });
  introSteps.forEach((step, index) => {
    const isActive = index === pairIndex;
    step.classList.toggle("active", isActive);
    step.setAttribute("aria-pressed", String(isActive));
  });

  introQuestionText?.parentElement?.classList.add("question-changing");
  await sleep(260);
  if (token !== definitionToken) return;

  renderIntroQuestion(pair.question);
  introQuestionText?.parentElement?.classList.remove("question-changing");

  await sleep(260);
  if (token !== definitionToken) return;

  pair.card.classList.add("active");
  if (pair.copy) await typeDefinitionWords(pair.copy, pair.answer);

  if (shouldContinue) {
    definitionTimer = window.setTimeout(() => {
      const nextIndex = (definitionIndex + 1) % definitionPairs.length;
      showDefinitionStep(nextIndex);
    }, definitionReadDelay);
  }
}

function runDefinitionSequence() {
  if (definitionStarted || definitionPairs.length === 0) return;
  definitionStarted = true;
  showDefinitionStep(0);
}

introSteps.forEach((step, index) => {
  step.addEventListener("click", () => {
    definitionStarted = true;
    introBand?.classList.add("in-view");
    showDefinitionStep(index);
  });
});

if (introBand) {
  const introObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      introBand.classList.add("in-view");
      runDefinitionSequence();
      introObserver.disconnect();
    },
    { threshold: 0.32 },
  );

  introObserver.observe(introBand);
} else {
  runDefinitionSequence();
}

const systemTransition = document.querySelector(".system-transition");
const desktopReveal = document.querySelector(".desktop-reveal");

function getScrollProgress(element) {
  const rect = element.getBoundingClientRect();
  const travel = Math.max(window.innerHeight + rect.height, 1);
  return Math.min(Math.max((window.innerHeight - rect.top) / travel, 0), 1);
}

function updateScrollReveals() {
  if (systemTransition) {
    systemTransition.style.setProperty("--system-progress", getScrollProgress(systemTransition).toFixed(3));
  }

  if (desktopReveal) {
    desktopReveal.style.setProperty("--desktop-progress", getScrollProgress(desktopReveal).toFixed(3));
  }
}

window.addEventListener("scroll", updateScrollReveals, { passive: true });
window.addEventListener("resize", updateScrollReveals);
updateScrollReveals();

const featureDetails = {
  create: {
    step: "01",
    title: "Se crea la experiencia",
    text:
      "El anfitrión configura el evento como público o privado, define cupos, precio, fecha, ruta, reglas y aliados. La pantalla convierte una idea turística en una oferta lista para operar, vender y controlar.",
    callouts: [
      ["Tipo de evento", "Permite separar experiencias públicas, privadas o de cluster para controlar visibilidad y acceso."],
      ["Cupos y fecha", "La capacidad, disponibilidad y calendario quedan centralizados desde el inicio."],
      ["Acciones", "Editar, duplicar, validar o revisar el evento sin perder trazabilidad operativa."],
    ],
  },
  distribution: {
    step: "02",
    title: "Se distribuye la oferta",
    text:
      "La experiencia deja de vivir en una conversación aislada y pasa a conectarse con clusters, comercios, comisionistas y canales de venta que pueden mover demanda con reglas claras.",
    callouts: [
      ["Segmentos", "Filtros por público, privado o cluster para organizar la oferta disponible."],
      ["Rutas activas", "Cada experiencia puede conectarse a un canal de comercialización concreto."],
      ["Estado visible", "La disponibilidad se comunica en tiempo real para evitar venta desordenada."],
    ],
  },
  logistics: {
    step: "03",
    title: "Se coordina la logística",
    text:
      "Transporte, pasajeros, puntos de salida, capacidad y responsables se integran al evento para que la operación avance con menos fricción y más control.",
    callouts: [
      ["Salida", "Agrupa fechas, puntos de encuentro y condiciones operativas."],
      ["Capacidad", "El cupo disponible se ve y se ajusta sin hojas paralelas."],
      ["Responsables", "Transportistas y aliados quedan vinculados al evento."],
    ],
  },
  value: {
    step: "04",
    title: "Se registra el valor",
    text:
      "La actividad genera historial: ventas, cupos, pagos, liquidaciones y datos que muestran movimiento económico real. Esa trazabilidad es la base para medir impacto y buscar financiamiento.",
    callouts: [
      ["Precio", "Cada ruta mantiene su valor visible y comparable."],
      ["Liquidación", "Pagos y saldos pueden relacionarse con la operación real."],
      ["Historial", "Los datos acumulados sirven para reportar impacto y crecimiento."],
    ],
  },
};

const featureModal = document.getElementById("featureModal");
const featureModalPanel = featureModal?.querySelector(".feature-modal-panel");
const featureModalStep = document.getElementById("featureModalStep");
const featureModalTitle = document.getElementById("featureModalTitle");
const featureModalText = document.getElementById("featureModalText");
const featureCallouts = document.getElementById("featureCallouts");

function openFeatureModal(key) {
  const detail = featureDetails[key];
  if (!featureModal || !detail) return;

  featureModalStep.textContent = detail.step;
  featureModalTitle.textContent = detail.title;
  featureModalText.textContent = detail.text;
  featureCallouts.innerHTML = detail.callouts
    .map(([title, body]) => `<li><strong>${title}</strong>${body}</li>`)
    .join("");
  featureModalPanel?.classList.toggle("has-extra", key === "create");
  if (featureModalPanel) featureModalPanel.scrollTop = 0;

  featureModal.classList.add("open");
  featureModal.setAttribute("aria-hidden", "false");
}

function closeFeatureModal() {
  if (!featureModal) return;
  featureModal.classList.remove("open");
  featureModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".flow-more").forEach((button) => {
  button.addEventListener("click", () => openFeatureModal(button.dataset.detail));
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", closeFeatureModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeFeatureModal();
});

const tourReelStage = document.querySelector(".tour-reel-stage");
const tourReelSection = document.querySelector(".tour-reel-section");
const tourReelPreview = document.querySelector(".tour-reel-preview");
const tourReelPreviewImage = tourReelPreview?.querySelector("img");
const tourReelPreviewLabel = tourReelPreview?.querySelector("span");

document.querySelectorAll(".image-reel-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    if (!tourReelSection || !tourReelPreviewImage || !tourReelPreviewLabel) return;

    tourReelPreviewImage.src = card.dataset.preview || "";
    tourReelPreviewLabel.textContent = card.dataset.previewLabel || card.textContent.trim();
    tourReelSection.classList.add("preview-open");
  });

  card.addEventListener("mouseleave", () => {
    tourReelSection?.classList.remove("preview-open");
  });
});
