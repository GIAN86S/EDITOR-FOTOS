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

// Input del nombre
const inputNombre = document.getElementById("nombre");
let nombreUsuario = "";

// Actualiza el nombre en tiempo real
inputNombre.addEventListener("input", () => {
  nombreUsuario = inputNombre.value.toUpperCase(); // Forzamos mayúsculas
  dibujar();
});

// Cargar imagen del usuario
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

// Mover imagen con mouse
canvas.addEventListener("mousedown", (e) => {
  arrastrando = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!arrastrando) return;
  const dx = e.offsetX - startX;
  const dy = e.offsetY - startY;
  offsetX += dx * 1.5;
  offsetY += dy * 1.5;
  startX = e.offsetX;
  startY = e.offsetY;
  dibujar();
});

canvas.addEventListener("mouseup", () => arrastrando = false);
canvas.addEventListener("mouseleave", () => arrastrando = false);

// Zoom con scroll
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleAmount = 0.1;
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  escala = Math.max(0.1, escala);
  dibujar();
});

// Toques táctiles
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
    offsetX += dx * 1.5;
    offsetY += dy * 1.5;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dibujar();
  } else if (e.touches.length === 2) {
    const dist = getTouchDistance(e.touches);
    if (lastTouchDist) {
      const delta = dist - lastTouchDist;
      escala += delta * 0.005;
      escala = Math.max(0.1, escala);
      dibujar();
    }
    lastTouchDist = dist;
  }
});

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Descargar imagen y redirigir
document.getElementById("descargar").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "imagen_con_nombre.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  setTimeout(() => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScADVWa0UdVU037NE1UwkhS2RH529WnIFmWOfeX64XIuj6nLw/viewform?usp=dialog";
  }, 5000);
});

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fotoUsuario.src && fotoUsuario.complete) {
    ctx.drawImage(fotoUsuario, offsetX, offsetY, fotoUsuario.width * escala, fotoUsuario.height * escala);
  }

  // Dibuja el nombre en la parte inferior sobre la imagen
  if (nombreUsuario.trim() !== "") {
    ctx.font = "bold 80px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(nombreUsuario, canvas.width / 2, canvas.height - 60);
  }

  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}

function mostrarMensajeFlotante() {
  const mensaje = document.getElementById("mensaje-flotante");
  mensaje.style.display = "block";
  setTimeout(() => mensaje.style.display = "none", 3000);
}
