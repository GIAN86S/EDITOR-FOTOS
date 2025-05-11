const input = document.getElementById("imagen");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marco = new Image();
marco.src = "assets/marco.png";

let fotoUsuario = new Image();
let offsetX = 0, offsetY = 0, escala = 1;
let arrastrando = false;
let startX, startY;
let lastTouchDist = null;

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
      mostrarMensajeFlotante();
      dibujar();
    };
    fotoUsuario.src = ev.target.result;
  };
  lector.readAsDataURL(archivo);
});

canvas.addEventListener("mousedown", (e) => {
  arrastrando = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!arrastrando) return;
  const dx = e.offsetX - startX;
  const dy = e.offsetY - startY;
  offsetX += dx * 1.5; // movimiento más rápido
  offsetY += dy * 1.5;
  startX = e.offsetX;
  startY = e.offsetY;
  dibujar();
});

canvas.addEventListener("mouseup", () => (arrastrando = false));
canvas.addEventListener("mouseleave", () => (arrastrando = false));

// Zoom con rueda
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleAmount = 0.1; // más rápido
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  escala = Math.max(0.1, escala);
  dibujar();
});

// Soporte táctil
canvas.addEventListener("touchstart", (e) => {
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
    offsetX += dx * 1.5; // movimiento más rápido
    offsetY += dy * 1.5;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dibujar();
  } else if (e.touches.length === 2) {
    const dist = getTouchDistance(e.touches);
    if (lastTouchDist) {
      const delta = dist - lastTouchDist;
      escala += delta * 0.005; // zoom más rápido
      escala = Math.max(0.1, escala);
      dibujar();
    }
    lastTouchDist = dist;
  }
});

canvas.addEventListener("touchend", () => {
  lastTouchDist = null;
});

document.getElementById("descargar").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "imagen_con_marco.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

function mostrarMensajeFlotante() {
  const mensaje = document.getElementById("mensaje-flotante");
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 5000);
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fotoUsuario.src && fotoUsuario.complete) {
    const w = fotoUsuario.width * escala;
    const h = fotoUsuario.height * escala;
    ctx.drawImage(fotoUsuario, offsetX, offsetY, w, h);
  }

  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}
