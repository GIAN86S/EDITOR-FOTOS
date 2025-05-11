// Obtener elementos del DOM
const inputImagen = document.getElementById("inputImagen"); // Input para subir imagen
const canvas = document.getElementById("canvas"); // Lienzo donde se edita la imagen
const ctx = canvas.getContext("2d"); // Contexto 2D del canvas para dibujar
const mensajeSubida = document.getElementById("mensajeSubida"); // Elemento para mostrar mensaje flotante
const botonDescargar = document.getElementById("descargarImagen"); // Botón para descargar la imagen
const contadorDescargas = document.getElementById("contadorDescargas"); // Contador de descargas en pantalla

// Cargar el marco desde la carpeta assets
const marco = new Image();
marco.src = "assets/marco.png"; // Ruta al marco

let imagen = null; // Imagen cargada por el usuario
let offsetX, offsetY; // Coordenadas para arrastrar la imagen
let isDragging = false; // Indica si se está arrastrando
let scale = 1; // Escala actual de la imagen
let position = { x: 0, y: 0 }; // Posición actual de la imagen

// Mostrar mensaje flotante durante 5 segundos
function mostrarMensaje() {
  mensajeSubida.classList.add("visible");
  setTimeout(() => {
    mensajeSubida.classList.remove("visible");
  }, 5000);
}

// Evento al subir una imagen
inputImagen.addEventListener("change", (e) => {
  const archivo = e.target.files[0]; // Tomar el archivo seleccionado
  if (!archivo) return; // Si no hay archivo, salir

  const lector = new FileReader(); // Crear lector de archivo
  lector.onload = function (evento) {
    const img = new Image(); // Crear nueva imagen
    img.onload = function () {
      imagen = img; // Guardar imagen cargada
      position = { x: canvas.width / 2 - img.width / 2, y: canvas.height / 2 - img.height / 2 }; // Centrar imagen
      scale = 1; // Reiniciar escala
      dibujarImagen(); // Dibujar imagen con marco
      mostrarMensaje(); // Mostrar mensaje flotante
    };
    img.src = evento.target.result; // Leer imagen como data URL
  };
  lector.readAsDataURL(archivo); // Iniciar lectura del archivo
});

// Dibujar imagen y marco
function dibujarImagen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
  if (imagen) {
    const ancho = imagen.width * scale; // Calcular ancho escalado
    const alto = imagen.height * scale; // Calcular alto escalado
    ctx.drawImage(imagen, position.x, position.y, ancho, alto); // Dibujar imagen
  }
  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height); // Dibujar marco encima
}

// Obtener coordenadas según mouse o touch
function obtenerCoordenadas(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }; // Coordenadas táctiles
  }
  return { x: e.clientX, y: e.clientY }; // Coordenadas de mouse
}

// Eventos para arrastrar la imagen (PC y móviles)
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
  const dx = coords.x - offsetX; // Diferencia X
  const dy = coords.y - offsetY; // Diferencia Y
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

// Zoom con mouse o gestos
canvas.addEventListener("wheel", (e) => {
  if (!imagen) return;
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.max(0.1, Math.min(5, scale));
  dibujarImagen();
});

// Gestos multitouch para escalar en móviles
canvas.addEventListener("touchstart", handlePinchStart, { passive: false });
canvas.addEventListener("touchmove", handlePinchMove, { passive: false });

let initialPinchDistance = null; // Distancia inicial entre dedos

function handlePinchStart(e) {
  if (e.touches.length === 2) {
    initialPinchDistance = getPinchDistance(e.touches); // Guardar distancia inicial
  }
}

function handlePinchMove(e) {
  if (!imagen || e.touches.length !== 2 || initialPinchDistance === null) return;
  e.preventDefault();
  const newDistance = getPinchDistance(e.touches); // Nueva distancia
  const pinchScale = newDistance / initialPinchDistance; // Escala relativa
  scale *= pinchScale;
  scale = Math.max(0.1, Math.min(5, scale));
  initialPinchDistance = newDistance;
  dibujarImagen();
}

function getPinchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy); // Calcular distancia entre dedos
}

// Descargar la imagen con marco
botonDescargar.addEventListener("click", () => {
  if (!imagen) return;
  const enlace = document.createElement("a");
  enlace.download = "imagen-editada.png";
  enlace.href = canvas.toDataURL("image/png");
  enlace.click();

  // Simular contador usando localStorage
  let descargas = localStorage.getItem("contadorDescargas") || 0;
  descargas++;
  localStorage.setItem("contadorDescargas", descargas);
  contadorDescargas.textContent = descargas;
});
