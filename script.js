const btnSi = document.getElementById("btnSi");
const btnMentira = document.getElementById("btnMentira");
const hueco = document.getElementById("hueco");
const botones = document.getElementById("botones");
const pregunta = document.getElementById("pregunta");

/* ---------- Fondo dinámico de corazones ---------- */
const canvas = document.getElementById("fondo");
const ctx = canvas.getContext("2d");
const COLORES = ["#ff5c93", "#ff8fb0", "#ffb3c7", "#c9a8ff", "#ffffff"];
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let corazones = [];

function ajustarCanvas() {
  const d = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * d;
  canvas.height = window.innerHeight * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
}

function nuevoCorazon(x, y, rapido) {
  return {
    x: x ?? Math.random() * window.innerWidth,
    y: y ?? window.innerHeight + 30,
    tam: 12 + Math.random() * 28,
    vel: (rapido ? 1.5 : 0.4) + Math.random() * (rapido ? 2.5 : 1.1),
    fase: Math.random() * Math.PI * 2,
    amp: 0.4 + Math.random(),
    ang: (Math.random() - 0.5) * 0.6,
    giro: (Math.random() - 0.5) * 0.02,
    alfa: 0.35 + Math.random() * 0.5,
    color: COLORES[Math.floor(Math.random() * COLORES.length)],
  };
}

function dibujarCorazon(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(c.ang);
  ctx.scale(c.tam / 20, c.tam / 20);
  ctx.globalAlpha = c.alfa;
  ctx.fillStyle = c.color;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-20, -6, -10, -20, 0, -8);
  ctx.bezierCurveTo(10, -20, 20, -6, 0, 8);
  ctx.fill();
  ctx.restore();
}

function animar() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const objetivo = window.innerWidth < 600 ? 28 : 50;
  corazones = corazones.filter((c) => c.y > -50);
  while (corazones.length < objetivo) corazones.push(nuevoCorazon());
  for (const c of corazones) {
    c.y -= c.vel;
    c.fase += 0.03;
    c.x += Math.sin(c.fase) * c.amp;
    c.ang += c.giro;
    dibujarCorazon(c);
  }
  requestAnimationFrame(animar);
}

function lluviaDeCorazones(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    corazones.push(nuevoCorazon(null, window.innerHeight + Math.random() * 250, true));
  }
}

ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);

if (sinMovimiento) {
  for (let i = 0; i < 30; i++) {
    const c = nuevoCorazon(null, Math.random() * window.innerHeight);
    dibujarCorazon(c);
  }
} else {
  for (let i = 0; i < 40; i++) {
    corazones.push(nuevoCorazon(null, Math.random() * window.innerHeight));
  }
  animar();
  // Estela de corazones al mover el mouse o el dedo
  window.addEventListener("pointermove", (e) => {
    if (Math.random() < 0.25) {
      const c = nuevoCorazon(e.clientX, e.clientY, true);
      c.tam = 8 + Math.random() * 12;
      corazones.push(c);
    }
  });
}

/* ---------- Botón "Mentira" que esquiva ---------- */
// Cuántas veces esquiva antes de rendirse y convertirse en "Sí"
const ESQUIVES_MAXIMOS = 6;
let esquives = 0;
let convertido = false;

function moverBoton() {
  const margen = 12;
  const maxX = window.innerWidth - btnMentira.offsetWidth - margen;
  const maxY = window.innerHeight - btnMentira.offsetHeight - margen;
  btnMentira.style.left = Math.max(margen, Math.random() * maxX) + "px";
  btnMentira.style.top = Math.max(margen, Math.random() * maxY) + "px";
}

function esquivar(evento) {
  if (convertido) return;
  evento.preventDefault();

  // Primer esquive: reservar el lugar y despegar el botón de la tarjeta
  if (esquives === 0) {
    const r = btnMentira.getBoundingClientRect();
    hueco.style.width = r.width + "px";
    hueco.style.height = r.height + "px";
    btnMentira.style.left = r.left + "px";
    btnMentira.style.top = r.top + "px";
    btnMentira.classList.add("esquivando");
    void btnMentira.offsetWidth; // fuerza el reflow para animar el movimiento
  }

  esquives++;

  if (esquives > ESQUIVES_MAXIMOS) {
    convertirEnSi();
  } else {
    moverBoton();
  }
}

function convertirEnSi() {
  convertido = true;
  btnMentira.classList.remove("esquivando");
  btnMentira.classList.add("ahora-si");
  btnMentira.style.left = "";
  btnMentira.style.top = "";
  btnMentira.textContent = "Sí";
  hueco.style.width = "";
  hueco.style.height = "";
}

/* ---------- Qué pasa al decir que Sí ---------- */
// Podés editar la carta a gusto: respeta los saltos de línea tal cual.
const CARTA = `Bebu:

Me costó arrancar esta carta. No soy de decir las cosas lindas en voz alta y siempre siento que me quedo corto, así que la escribo y listo.

Empezamos el 21 de septiembre, el día de la primavera, y a veces pienso que no podía ser otra fecha. Con vos todo se siente más liviano, hasta los días que venían medio torcidos.

Me encanta lo fácil que es estar con vos. No tengo que hacerme el canchero ni pensar qué decir, puedo ser yo nomás, con mis chistes malos y todo.

Gracias por la paciencia, por las risas y por hacerme un lugarcito en tus días. Un mensaje tuyo me cambia el humor, aunque sea para decirme una pavada.

No sé todo lo que viene, pero sé que quiero que me encuentre con vos al lado.

Feliz cumplemes, mi amor. Te amo, y el botón de mentira no cuenta.

Gonzalo, el amor de tu vida y tu papá en el pool jajaja!!!`;

const gatitos = document.getElementById("gatitos");
const final = document.getElementById("final");
const carta = document.getElementById("carta");
const cartaTexto = document.getElementById("cartaTexto");
const regalo = document.getElementById("regalo");
const caja = document.getElementById("caja");
const cupon = document.getElementById("cupon");
let celebrado = false;

function celebrar() {
  if (celebrado) return;
  celebrado = true;
  pregunta.textContent = "¡Yo también te amo! 💖";
  botones.classList.add("oculto");
  lluviaDeCorazones(70);
  gatitosEnamorados();
  setTimeout(escribirCarta, 1800);
}

function gatitosEnamorados() {
  gatitos.classList.add("enamorados");
  gatitos.querySelectorAll("use").forEach((u) => u.setAttribute("href", "#gatito-amor"));
}

function escribirCarta() {
  final.classList.remove("oculto");
  carta.classList.add("escribiendo");
  carta.scrollIntoView({ behavior: "smooth", block: "nearest" });

  let i = 0;
  let terminado = false;
  const timer = setInterval(() => {
    i++;
    cartaTexto.textContent = CARTA.slice(0, i);
    if (i % 60 === 0) carta.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (i >= CARTA.length) terminar();
  }, 22);

  function terminar() {
    if (terminado) return;
    terminado = true;
    clearInterval(timer);
    cartaTexto.textContent = CARTA;
    carta.classList.remove("escribiendo");
    mostrarRegalo();
  }

  // Tocar la carta la muestra completa de una
  carta.addEventListener("click", terminar, { once: true });
}

function mostrarRegalo() {
  regalo.classList.remove("oculto");
  setTimeout(() => regalo.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
}

caja.addEventListener("click", () => {
  if (caja.classList.contains("abierta")) return;
  caja.classList.add("abierta");
  caja.textContent = "🎉";
  cupon.classList.remove("oculto");
  lluviaDeCorazones(50);
  setTimeout(() => cupon.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
});

// Mouse y touch: esquiva apenas se acerca o lo toca. Click cubre el teclado.
btnMentira.addEventListener("pointerenter", esquivar);
btnMentira.addEventListener("click", (e) => {
  if (!convertido) esquivar(e);
  else celebrar();
});

btnSi.addEventListener("click", celebrar);

// Si cambia el tamaño de pantalla mientras esquiva, lo mantiene visible
window.addEventListener("resize", () => {
  if (esquives > 0 && !convertido) moverBoton();
});

/* ---------- Contador de tiempo juntos ---------- */
// 21 de septiembre (día de la primavera). Si fue en otro año, cambiá el 2026.
const INICIO = new Date(2026, 8, 21, 0, 0, 0);

const cAnios = document.getElementById("c-anios");
const uAnios = document.getElementById("u-anios");
const cMeses = document.getElementById("c-meses");
const cDias = document.getElementById("c-dias");
const cHoras = document.getElementById("c-horas");
const cMin = document.getElementById("c-min");
const cSeg = document.getElementById("c-seg");

const dos = (n) => String(n).padStart(2, "0");

function actualizarContador() {
  const ahora = new Date();
  let meses = 0;
  let resto = 0;

  if (ahora > INICIO) {
    meses = (ahora.getFullYear() - INICIO.getFullYear()) * 12 + (ahora.getMonth() - INICIO.getMonth());
    let base = new Date(INICIO.getFullYear(), INICIO.getMonth() + meses, INICIO.getDate());
    if (base > ahora) {
      meses--;
      base = new Date(INICIO.getFullYear(), INICIO.getMonth() + meses, INICIO.getDate());
    }
    resto = ahora - base;
  }

  const anios = Math.floor(meses / 12);
  uAnios.hidden = anios === 0;
  cAnios.textContent = anios;
  cMeses.textContent = meses % 12;
  cDias.textContent = Math.floor(resto / 86400000);
  cHoras.textContent = dos(Math.floor(resto / 3600000) % 24);
  cMin.textContent = dos(Math.floor(resto / 60000) % 60);
  cSeg.textContent = dos(Math.floor(resto / 1000) % 60);
}

actualizarContador();
setInterval(actualizarContador, 1000);
