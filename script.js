// Obtener elementos del DOM
const inputImagen = document.getElementById("inputImagen");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mensajeSubida = document.getElementById("mensajeSubida");
const botonDescargar = document.getElementById("descargarImagen");
const contadorDescargas = document.getElementById("contadorDescargas");

let imagen = null;
let offsetX, offsetY;
let isDragging = false;
let scale = 1;
let position = { x: 0, y: 0 };

// Mostrar mensaje flotante durante 5 segundos
function mostrarMensaje() {
  mensajeSubida.classList.add("visible");
  setTimeout(() => {
    mensajeSubida.classList.remove("visible");
  }, 5000);
}

// Manejar carga de imagen
inputImagen.addEventListener("change", (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (evento) {
    const img = new Image();
    img.onload = function () {
      imagen = img;
      position = { x: canvas.width / 2 - img.width / 2, y: canvas.height / 2 - img.height / 2 };
      scale = 1;
      dibujarImagen();
      mostrarMensaje();
    };
    img.src = evento.target.result;
  };
  lector.readAsDataURL(archivo);
});

// Dibujar imagen en canvas
function dibujarImagen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (imagen) {
    const ancho = imagen.width * scale;
    const alto = imagen.height * scale;
    ctx.drawImage(imagen, position.x, position.y, ancho, alto);
  }
}

// Manejar movimiento con mouse o touch
function obtenerCoordenadas(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

canvas.addEventListener("mousedown", (e) => {
  if (!imagen) return;
  const coords = obtenerCoordenadas(e);
  offsetX = coords.x;
  offsetY = coords.y;
  isDragging = true;
});

canvas.addEventListener("touchstart", (e) => {
  if (!imagen) return;
  const coords = obtenerCoordenadas(e);
  offsetX = coords.x;
  offsetY = coords.y;
  isDragging = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging || !imagen) return;
  const coords = obtenerCoordenadas(e);
  const dx = coords.x - offsetX;
  const dy = coords.y - offsetY;
  offsetX = coords.x;
  offsetY = coords.y;
  position.x += dx;
  position.y += dy;
  dibujarImagen();
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDragging || !imagen) return;
  const coords = obtenerCoordenadas(e);
  const dx = coords.x - offsetX;
  const dy = coords.y - offsetY;
  offsetX = coords.x;
  offsetY = coords.y;
  position.x += dx;
  position.y += dy;
  dibujarImagen();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);
canvas.addEventListener("touchend", () => isDragging = false);

// Escalar imagen con gestos de zoom en móvil o rueda del mouse
canvas.addEventListener("wheel", (e) => {
  if (!imagen) return;
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.max(0.1, Math.min(5, scale));
  dibujarImagen();
});

canvas.addEventListener("touchstart", handlePinchStart, { passive: false });
canvas.addEventListener("touchmove", handlePinchMove, { passive: false });

let initialPinchDistance = null;

function handlePinchStart(e) {
  if (e.touches.length === 2) {
    initialPinchDistance = getPinchDistance(e.touches);
  }
}

function handlePinchMove(e) {
  if (!imagen || e.touches.length !== 2 || initialPinchDistance === null) return;
  e.preventDefault();
  const newDistance = getPinchDistance(e.touches);
  const pinchScale = newDistance / initialPinchDistance;
  scale *= pinchScale;
  scale = Math.max(0.1, Math.min(5, scale));
  initialPinchDistance = newDistance;
  dibujarImagen();
}

function getPinchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Descargar imagen
botonDescargar.addEventListener("click", () => {
  if (!imagen) return;
  const enlace = document.createElement("a");
  enlace.download = "imagen-editada.png";
  enlace.href = canvas.toDataURL("image/png");
  enlace.click();

  // Actualizar contador (simulado con localStorage)
  let descargas = localStorage.getItem("contadorDescargas") || 0;
  descargas++;
  localStorage.setItem("contadorDescargas", descargas);
  contadorDescargas.textContent = descargas;
});
