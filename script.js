// Referencias a elementos HTML
const input = document.getElementById("imagen"); // Obtiene el elemento input para subir imágenes
const canvas = document.getElementById("canvas"); // Obtiene el elemento canvas donde se dibujará la imagen
const ctx = canvas.getContext("2d"); // Obtiene el contexto 2D del canvas para dibujar en él
const marco = new Image(); // Crea un objeto de imagen para el marco
marco.src = "assets/marco.png"; // Asigna la fuente de la imagen del marco

// Variables para controlar la imagen del usuario
let fotoUsuario = new Image(); // Crea un objeto de imagen para la foto del usuario
let offsetX = 0, offsetY = 0, escala = 1; // Variables para la posición y escala de la imagen
let arrastrando = false; // Variable para determinar si el usuario está arrastrando la imagen
let startX, startY; // Variables para almacenar la posición inicial del arrastre
let lastTouchDist = null; // Variable para controlar la escala en dispositivos táctiles

// Cuando se sube una imagen
input.addEventListener("change", (e) => {
  const archivo = e.target.files[0]; // Obtiene el archivo seleccionado
  if (!archivo) return; // Si no hay archivo, no hace nada
  const lector = new FileReader(); // Crea un lector de archivos

  lector.onload = (ev) => {
    fotoUsuario = new Image(); // Crea una nueva imagen con el archivo cargado
    fotoUsuario.onload = () => {
      // Calcula el escalado inicial para que encaje en el canvas
      escala = Math.min(canvas.width / fotoUsuario.width, canvas.height / fotoUsuario.height);
      offsetX = (canvas.width - fotoUsuario.width * escala) / 2;
      offsetY = (canvas.height - fotoUsuario.height * escala) / 2;
      mostrarMensajeFlotante(); // Muestra mensaje de imagen subida
      dibujar(); // Dibuja la imagen y el marco en el canvas
    };
    fotoUsuario.src = ev.target.result; // Asigna la fuente de la imagen con el archivo cargado
  };

  lector.readAsDataURL(archivo); // Lee el archivo como una URL de datos
});

// Eventos para mover la imagen con el mouse
canvas.addEventListener("mousedown", (e) => {
  arrastrando = true; // Activa el estado de arrastre
  startX = e.offsetX; // Guarda la posición inicial del clic
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!arrastrando) return; // Si no se está arrastrando, no hace nada
  const dx = e.offsetX - startX; // Calcula el cambio en X
  const dy = e.offsetY - startY; // Calcula el cambio en Y
  offsetX += dx * 1.5; // Ajusta la posición X
  offsetY += dy * 1.5; // Ajusta la posición Y
  startX = e.offsetX; // Actualiza la posición inicial
  startY = e.offsetY;
  dibujar(); // Redibuja la imagen
});

canvas.addEventListener("mouseup", () => (arrastrando = false)); // Desactiva el arrastre
canvas.addEventListener("mouseleave", () => (arrastrando = false)); // Desactiva si el mouse sale del canvas

// Zoom con la rueda del mouse
canvas.addEventListener("wheel", (e) => {
  e.preventDefault(); // Evita el desplazamiento predeterminado
  const scaleAmount = 0.1; // Cantidad de escala por movimiento
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount; // Ajusta el tamaño dependiendo del scroll
  escala = Math.max(0.1, escala); // Establece un límite mínimo
  dibujar(); // Redibuja
});

// Manejo táctil para mover y escalar con dedos
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

document.getElementById("descargar").addEventListener("click", () => {
  // 1. Inicia la descarga de la imagen
  const link = document.createElement("a");
  link.download = "imagen_con_nombre.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  // 2. Redirige al formulario después de 1 segundo para asegurar que la descarga ocurra primero
  setTimeout(() => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScADVWa0UdVU037NE1UwkhS2RH529WnIFmWOfeX64XIuj6nLw/viewform?usp=dialog";
  }, 1000); // 1 segundo de retraso
});


function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (fotoUsuario.src && fotoUsuario.complete) {
    ctx.drawImage(fotoUsuario, offsetX, offsetY, fotoUsuario.width * escala, fotoUsuario.height * escala);
  }
  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}
