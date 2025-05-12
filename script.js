const input = document.getElementById("imagen");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marco = new Image(); // Imagen del marco
marco.src = "assets/marco.png";
const input = document.getElementById("imagen"); // Obtiene el elemento input para subir imágenes
const canvas = document.getElementById("canvas"); // Obtiene el elemento canvas donde se dibujará la imagen
const ctx = canvas.getContext("2d"); // Obtiene el contexto 2D del canvas para dibujar en él
const marco = new Image(); // Crea un objeto de imagen para el marco
marco.src = "assets/marco.png"; // Asigna la fuente de la imagen del marco

// Variables para controlar la imagen del usuario
let fotoUsuario = new Image();
let offsetX = 0, offsetY = 0, escala = 1;
let arrastrando = false;
let startX, startY;
let lastTouchDist = null;
let fotoUsuario = new Image(); // Crea un objeto de imagen para la foto del usuario
let offsetX = 0, offsetY = 0, escala = 1; // Variables para la posición y escala de la imagen
let arrastrando = false; // Variable para determinar si el usuario está arrastrando la imagen
let startX, startY; // Variables para almacenar la posición inicial del arrastre
let lastTouchDist = null; // Variable para controlar la escala en dispositivos táctiles

// Cuando se sube una imagen
input.addEventListener("change", (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  const lector = new FileReader();
  const archivo = e.target.files[0]; // Obtiene el archivo seleccionado
  if (!archivo) return; // Si no hay archivo, no hace nada
  const lector = new FileReader(); // Crea un lector de archivos

  lector.onload = (ev) => {
    fotoUsuario = new Image();
    fotoUsuario = new Image(); // Crea una nueva imagen con el archivo cargado
    fotoUsuario.onload = () => {
      // Calcula el escalado inicial para que encaje
      // Calcula el escalado inicial para que encaje en el canvas
      escala = Math.min(canvas.width / fotoUsuario.width, canvas.height / fotoUsuario.height);
      offsetX = (canvas.width - fotoUsuario.width * escala) / 2;
      offsetY = (canvas.height - fotoUsuario.height * escala) / 2;
      mostrarMensajeFlotante(); // Muestra mensaje
      dibujar(); // Dibuja imagen y marco
      mostrarMensajeFlotante(); // Muestra mensaje de imagen subida
      dibujar(); // Dibuja la imagen y el marco en el canvas
    };
    fotoUsuario.src = ev.target.result;
    fotoUsuario.src = ev.target.result; // Asigna la fuente de la imagen con el archivo cargado
  };

  lector.readAsDataURL(archivo);
  lector.readAsDataURL(archivo); // Lee el archivo como una URL de datos
});

// Eventos para mover la imagen con mouse
// Eventos para mover la imagen con el mouse
canvas.addEventListener("mousedown", (e) => {
  arrastrando = true;
  startX = e.offsetX;
  arrastrando = true; // Activa el estado de arrastre
  startX = e.offsetX; // Guarda la posición inicial del clic
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!arrastrando) return;
  const dx = e.offsetX - startX;
  const dy = e.offsetY - startY;
  offsetX += dx * 1.5; // Más rápido
  offsetY += dy * 1.5;
  startX = e.offsetX;
  if (!arrastrando) return; // Si no se está arrastrando, no hace nada
  const dx = e.offsetX - startX; // Calcula el cambio en X
  const dy = e.offsetY - startY; // Calcula el cambio en Y
  offsetX += dx * 1.5; // Ajusta la posición X
  offsetY += dy * 1.5; // Ajusta la posición Y
  startX = e.offsetX; // Actualiza la posición inicial
  startY = e.offsetY;
  dibujar();
  dibujar(); // Redibuja la imagen
});

canvas.addEventListener("mouseup", () => (arrastrando = false));
canvas.addEventListener("mouseleave", () => (arrastrando = false));
canvas.addEventListener("mouseup", () => (arrastrando = false)); // Desactiva el arrastre
canvas.addEventListener("mouseleave", () => (arrastrando = false)); // Desactiva si el mouse sale del canvas

// Zoom con la rueda del mouse
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleAmount = 0.1;
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  escala = Math.max(0.1, escala);
  dibujar();
  e.preventDefault(); // Evita el desplazamiento predeterminado
  const scaleAmount = 0.1; // Cantidad de escala por movimiento
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount; // Ajusta el tamaño dependiendo del scroll
  escala = Math.max(0.1, escala); // Establece un límite mínimo
  dibujar(); // Redibuja
});

// Soporte táctil para mover y escalar con dedos
// Manejo táctil para mover y escalar con dedos
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startX = e.touches[0].clientX;
    startX = e.touches[0].clientX; 
    startY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    lastTouchDist = getTouchDistance(e.touches);
    lastTouchDist = getTouchDistance(e.touches); 
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  e.preventDefault(); 
  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
@@ -96,10 +96,6 @@ canvas.addEventListener("touchmove", (e) => {
  }
});

canvas.addEventListener("touchend", () => {
  lastTouchDist = null;
});

// Descarga la imagen como PNG
document.getElementById("descargar").addEventListener("click", () => {
  const link = document.createElement("a");
@@ -108,31 +104,10 @@ document.getElementById("descargar").addEventListener("click", () => {
  link.click();
});

// Muestra el mensaje flotante durante 5 segundos
function mostrarMensajeFlotante() {
  const mensaje = document.getElementById("mensaje-flotante");
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 5000);
}

// Calcula la distancia entre dos toques
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Dibuja la imagen del usuario y el marco en el canvas
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fotoUsuario.src && fotoUsuario.complete) {
    const w = fotoUsuario.width * escala;
    const h = fotoUsuario.height * escala;
    ctx.drawImage(fotoUsuario, offsetX, offsetY, w, h);
    ctx.drawImage(fotoUsuario, offsetX, offsetY, fotoUsuario.width * escala, fotoUsuario.height * escala);
  }

  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}
