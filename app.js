/* ============================================================
   app.js — Lógica del juego de unidades de medida
   ============================================================ */

"use strict";

// ── Estado global ─────────────────────────────────────────────
const state = {
  data:           null,   // JSON cargado
  playerName:     "",
  totalQuestions: 10,
  modeLabel:      "Normal",
  questions:      [],     // preguntas barajadas para esta partida
  current:        0,      // índice actual
  points:         0,
  correct:        0,
  selectedOption: null,
};

// ── Emojis flotantes ──────────────────────────────────────────
const FLOAT_EMOJIS = ["📏","⚖️","🧴","📐","🔢","🌡️","📊","🔬","✏️","📌","🎯","⭐"];
function spawnFloatingEmojis() {
  const container = document.getElementById("floatingEmojis");
  container.innerHTML = "";
  FLOAT_EMOJIS.forEach((emoji, i) => {
    const el = document.createElement("div");
    el.classList.add("float-emoji");
    el.textContent = emoji;
    el.style.left     = `${5 + Math.random() * 90}%`;
    el.style.fontSize = `${1.2 + Math.random() * 1.6}rem`;
    el.style.animationDuration  = `${8 + Math.random() * 12}s`;
    el.style.animationDelay     = `${-Math.random() * 15}s`;
    container.appendChild(el);
  });
}

// ── Pantallas ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

// ── Helpers ───────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Carga del JSON ────────────────────────────────────────────
async function loadData() {
  try {
    const res  = await fetch("datos.json");
    if (!res.ok) throw new Error("No se pudo cargar datos.json");
    state.data = await res.json();
    // Pequeña pausa para que la animación de carga se vea
    await new Promise(r => setTimeout(r, 1800));
    initWelcome();
  } catch (err) {
    console.error(err);
    document.querySelector(".loading-title").textContent = "⚠️ Error al cargar";
    document.querySelector(".loading-sub").textContent   =
      "Asegúrate de usar un servidor local (ej: npx serve .)";
  }
}

// ── PANTALLA BIENVENIDA ───────────────────────────────────────
function initWelcome() {
  showScreen("screenWelcome");

  // Selector de modo
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.totalQuestions = parseInt(btn.dataset.mode, 10);
      state.modeLabel      = btn.dataset.label;
    });
  });

  document.getElementById("btnStart").addEventListener("click", startGame);
  document.getElementById("btnReviewWelcome").addEventListener("click", openModal);
}

// ── INICIO DEL JUEGO ──────────────────────────────────────────
function startGame() {
  const nameInput = document.getElementById("playerName").value.trim();
  state.playerName = nameInput || "Jugador";

  // Barajar y cortar preguntas
  const all         = shuffle(state.data.preguntas);
  state.questions   = all.slice(0, Math.min(state.totalQuestions, all.length));
  state.current     = 0;
  state.points      = 0;
  state.correct     = 0;

  // Botón "Repasar" visible solo en Rápido y Normal
  const btnReviewGame = document.getElementById("btnReviewGame");
  if (state.modeLabel === "Reto") {
    btnReviewGame.classList.add("hidden");
  } else {
    btnReviewGame.classList.remove("hidden");
    btnReviewGame.addEventListener("click", openModal);
  }

  showScreen("screenGame");
  renderQuestion();
}

// ── RENDERIZAR PREGUNTA ───────────────────────────────────────
function renderQuestion() {
  const q      = state.questions[state.current];
  const total  = state.questions.length;
  const idx    = state.current + 1;

  // Cabecera
  document.getElementById("headerName").textContent     = state.playerName;
  document.getElementById("headerQuestion").textContent = `P ${idx}/${total}`;
  document.getElementById("headerPoints").textContent   = `⭐ ${state.points}`;

  // Barra de progreso
  const pct = ((state.current) / total) * 100;
  document.getElementById("progressFill").style.width  = `${pct}%`;

  // Emoji y texto
  document.getElementById("questionEmoji").textContent = q.emoji || "❓";
  document.getElementById("questionText").textContent  = q.pregunta;

  // Opciones
  const grid = document.getElementById("optionsGrid");
  grid.innerHTML = "";
  state.selectedOption = null;

  q.opciones.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.addEventListener("click", () => selectOption(btn, i));
    grid.appendChild(btn);
  });

  // Botón confirmar
  const btnConfirm = document.getElementById("btnConfirm");
  btnConfirm.disabled = true;
  btnConfirm.onclick  = confirmAnswer;

  // Animación entrada
  const card = document.getElementById("questionCard");
  card.classList.remove("cardIn");
  void card.offsetWidth; // reflow
  card.classList.add("cardIn");
}

function selectOption(btn, index) {
  document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  state.selectedOption = index;
  document.getElementById("btnConfirm").disabled = false;
}

// ── CONFIRMAR RESPUESTA ───────────────────────────────────────
function confirmAnswer() {
  const q        = state.questions[state.current];
  const isCorrect = state.selectedOption === q.correcta;

  if (isCorrect) {
    state.points  += 10;
    state.correct += 1;
  }

  // Revelar colores en opciones
  document.querySelectorAll(".option-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correcta) {
      btn.classList.add("correct-reveal");
    } else if (i === state.selectedOption && !isCorrect) {
      btn.classList.add("wrong-reveal");
    }
  });
  document.getElementById("btnConfirm").disabled = true;

  // Mostrar feedback
  setTimeout(() => showFeedback(q, isCorrect), 450);
}

// ── FEEDBACK OVERLAY ──────────────────────────────────────────
function showFeedback(q, isCorrect) {
  const overlay = document.getElementById("overlayFeedback");
  overlay.classList.remove("hidden");

  document.getElementById("feedbackEmoji").textContent = isCorrect ? "🎉" : "💪";

  const titleEl = document.getElementById("feedbackTitle");
  titleEl.textContent = isCorrect ? "¡Correcto!" : "¡Casi!";
  titleEl.className   = "feedback-title " + (isCorrect ? "correct" : "wrong");

  // Badges
  const badgesEl = document.getElementById("feedbackBadges");
  badgesEl.innerHTML = "";

  const correctText = q.opciones[q.correcta];
  const badge = document.createElement("span");
  badge.classList.add("badge", isCorrect ? "badge-correct" : "badge-info");
  badge.innerHTML = `✅ ${correctText}`;
  badgesEl.appendChild(badge);

  if (!isCorrect) {
    const yourBadge = document.createElement("span");
    yourBadge.classList.add("badge", "badge-wrong");
    yourBadge.innerHTML = `❌ ${q.opciones[state.selectedOption]}`;
    badgesEl.appendChild(yourBadge);
  }

  document.getElementById("feedbackExplanation").textContent = q.explicacion;

  // Reaplicar popIn
  const card = overlay.querySelector(".feedback-card");
  card.classList.remove("popIn");
  void card.offsetWidth;
  card.classList.add("popIn");

  document.getElementById("btnNext").onclick = nextQuestion;
}

// ── SIGUIENTE PREGUNTA ────────────────────────────────────────
function nextQuestion() {
  document.getElementById("overlayFeedback").classList.add("hidden");
  state.current++;

  if (state.current < state.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

// ── RESULTADOS ────────────────────────────────────────────────
function showResults() {
  showScreen("screenResults");

  const total   = state.questions.length;
  const pct     = (state.correct / total) * 100;
  const maxPts  = total * 10;

  // Mascota y título
  let mascot, title;
  if (pct === 100)      { mascot = "🏆"; title = "¡Perfecto! ¡Eres increíble!"; }
  else if (pct >= 90)   { mascot = "🦸"; title = "¡Casi perfecto! ¡Súper!"; }
  else if (pct >= 80)   { mascot = "🌟"; title = "¡Muy bien hecho!"; }
  else if (pct >= 60)   { mascot = "😊"; title = "¡Buen trabajo!"; }
  else if (pct >= 40)   { mascot = "🐣"; title = "¡Sigue practicando!"; }
  else                  { mascot = "🌱"; title = "¡Vamos a aprender más!"; }

  document.getElementById("resultsMascot").textContent = mascot;
  document.getElementById("resultsTitle").textContent  = title;
  document.getElementById("resultsScore").textContent  = state.points;
  document.getElementById("resultsDetail").textContent =
    `${state.correct} de ${total} correctas · ${state.points}/${maxPts} puntos`;

  // Estrellas
  const stars = pct >= 80 ? "⭐⭐⭐" : pct >= 60 ? "⭐⭐" : "⭐";
  document.getElementById("resultsStars").textContent = stars;

  // Confeti si ≥ 80%
  if (pct >= 80) spawnConfetti();

  // Botones
  document.getElementById("btnPlayAgain").onclick  = () => { stopConfetti(); startGame(); };
  document.getElementById("btnChangeMode").onclick = () => { stopConfetti(); showScreen("screenWelcome"); };
}

// ── CONFETI ───────────────────────────────────────────────────
const CONFETTI_COLORS = ["#a8d8ea","#ffd3b6","#b8f0c0","#ffc8dd","#fff3b0","#d4c1ec","#7a7af0","#f0a060"];
let confettiTimer = null;

function spawnConfetti() {
  const container = document.getElementById("confettiContainer");
  container.innerHTML = "";

  function drop() {
    for (let i = 0; i < 8; i++) {
      const piece = document.createElement("div");
      piece.classList.add("confetti-piece");
      piece.style.left              = `${Math.random() * 100}%`;
      piece.style.background        = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.width             = `${6 + Math.random() * 10}px`;
      piece.style.height            = piece.style.width;
      piece.style.borderRadius      = Math.random() > .5 ? "50%" : "3px";
      piece.style.animationDuration = `${2 + Math.random() * 2.5}s`;
      piece.style.animationDelay    = `${Math.random() * .5}s`;
      container.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  drop();
  confettiTimer = setInterval(drop, 600);
  setTimeout(stopConfetti, 6000);
}

function stopConfetti() {
  clearInterval(confettiTimer);
  document.getElementById("confettiContainer").innerHTML = "";
}

// ── MODAL REPASAR ─────────────────────────────────────────────
function buildModalContent() {
  const modal   = document.getElementById("modalContent");
  modal.innerHTML = "";
  const tema    = state.data.tema;

  // Paletas por sección
  const palettes = [
    { bg: "#d4eef8", text: "#1a4a60", border: "#6ab8d8" },
    { bg: "#fde8d0", text: "#6a3010", border: "#f0a060" },
    { bg: "#d0f4d8", text: "#1a5030", border: "#60c070" },
  ];

  tema.secciones.forEach((sec, si) => {
    const pal = palettes[si % palettes.length];
    const div = document.createElement("div");
    div.classList.add("review-section");

    // Header de sección
    const hdr = document.createElement("div");
    hdr.classList.add("review-section-header");
    hdr.innerHTML = `
      <span class="review-section-icon">${sec.icono}</span>
      <span class="review-section-title">${sec.nombre}</span>
    `;
    div.appendChild(hdr);

    const desc = document.createElement("p");
    desc.classList.add("review-section-desc");
    desc.textContent = sec.descripcion;
    div.appendChild(desc);

    // Badges de unidades
    const unitsWrap = document.createElement("div");
    unitsWrap.classList.add("review-units");

    sec.unidades.forEach(u => {
      const badge = document.createElement("div");
      badge.classList.add("review-unit-badge");
      badge.style.background   = pal.bg;
      badge.style.color        = pal.text;
      badge.style.border       = `2px solid ${pal.border}`;
      badge.innerHTML = `
        <span class="unit-name">${u.nombre}</span>
        <span class="unit-symbol">${u.simbolo}</span>
        <span class="unit-equiv">${u.equivalencia}</span>
        <span class="unit-ex">Ej: ${u.ejemplo}</span>
      `;
      unitsWrap.appendChild(badge);
    });
    div.appendChild(unitsWrap);

    // Truco
    const truco = document.createElement("div");
    truco.classList.add("review-truco");
    truco.textContent = sec.truco;
    div.appendChild(truco);

    modal.appendChild(div);
  });
}

function openModal() {
  if (!state.data) return;
  buildModalContent();
  document.getElementById("modalReview").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalReview").classList.add("hidden");
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  spawnFloatingEmojis();
  showScreen("screenLoading");

  // Botones cerrar modal
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("btnCloseModalBottom").addEventListener("click", closeModal);

  // Cerrar modal al hacer clic fuera
  document.getElementById("modalReview").addEventListener("click", e => {
    if (e.target === document.getElementById("modalReview")) closeModal();
  });

  loadData();

  // Registrar service worker para PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Service Worker registrado:', reg.scope);
      })
      .catch(err => {
        console.warn('Service Worker no se pudo registrar:', err);
      });
  }
});
