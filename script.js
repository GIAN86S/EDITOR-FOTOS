const input = document.getElementById("imagen");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const marco = new Image();
marco.src = "assets/marco.png";

let fotoUsuario = new Image();
let offsetX = 0, offsetY = 0, escala = 1;
let arrastrando = false;
let startX, startY;
let isTouch = false;

input.addEventListener("change", (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = (ev) => {
    fotoUsuario = new Image();
    fotoUsuario.onload = () => {
      escala = Math.min(canvas.width / fotoUsuario.width, canvas.height / fotoUsuario.height);
      offsetX = (canvas.width - fotoUsuario.width * escala) / 2;
      offsetY = (canvas.height - fotoUsuario.height * escala) / 2;
      info.style.display = "block";
      mostrarMensajeFlotante();
      dibujar();
    };
    fotoUsuario.src = ev.target.result;
  };
  lector.readAsDataURL(archivo);
});

// Mouse drag
canvas.addEventListener("mousedown", (e) => {
  arrastrando = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!arrastrando) return;
  const dx = e.offsetX - startX;
  const dy = e.offsetY - startY;
  offsetX += dx;
  offsetY += dy;
  startX = e.offsetX;
  startY = e.offsetY;
  dibujar();
});

canvas.addEventListener("mouseup", () => (arrastrando = false));
canvas.addEventListener("mouseleave", () => (arrastrando = false));

// Zoom con rueda
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleAmount = 0.05;
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  escala = Math.max(0.1, escala);
  dibujar();
});

// Soporte táctil para arrastrar y hacer zoom (pinch)
let lastTouchDist = null;

canvas.addEventListener("touchstart", (e) => {
  isTouch = true;
  if (e.touches.length === 1) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    lastTouchDist = getTouchDistance(e.touches);
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    offsetX += dx;
    offsetY += dy;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dibujar();
  } else if (e.touches.length === 2) {
    const dist = getTouchDistance(e.touches);
    if (lastTouchDist) {
      const delta = dist - lastTouchDist;
      escala += delta * 0.001;
      escala = Math.max(0.1, escala);
      dibujar();
    }
    lastTouchDist = dist;
  }
});

canvas.addEventListener("touchend", () => {
  lastTouchDist = null;
});

// Descargar imagen
document.getElementById("descargar").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "imagen_con_marco.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Función para mostrar mensaje flotante
function mostrarMensajeFlotante() {
  const mensaje = document.getElementById("mensaje-flotante");
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 5000);
}

// Función para obtener distancia entre dos toques
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Dibuja la imagen del usuario + marco
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fotoUsuario.src && fotoUsuario.complete) {
    const w = fotoUsuario.width * escala;
    const h = fotoUsuario.height * escala;
    ctx.drawImage(fotoUsuario, offsetX, offsetY, w, h);
  }

  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}
