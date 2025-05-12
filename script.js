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
  // 1. Mostrar el mensaje de aviso con el botón OK
  const mensaje = document.getElementById("mensaje-aviso");
  mensaje.style.display = "block"; // Muestra el mensaje

  // 2. Esperar a que el usuario haga clic en "OK"
  document.getElementById("confirmar-ok").addEventListener("click", () => {
    // 2.1 Inicia la descarga de la imagen
    const link = document.createElement("a");
    link.download = "imagen_con_nombre.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // 2.2 Redirige al formulario después de la descarga
    setTimeout(() => {
      window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScADVWa0UdVU037NE1UwkhS2RH529WnIFmWOfeX64XIuj6nLw/viewform?usp=dialog";
    }, 500); // 500ms después de iniciar la descarga
  });
});



function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja la imagen del usuario
  if (fotoUsuario.src && fotoUsuario.complete) {
    ctx.drawImage(fotoUsuario, offsetX, offsetY, fotoUsuario.width * escala, fotoUsuario.height * escala);
  }

  // Dibuja el marco
  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);

  // Dibuja el texto (nombre)
  const nombre = document.getElementById("nombre").value.toUpperCase(); // Asegura mayúsculas
  if (nombre) {
    ctx.font = "italic 60px sans-serif"; // Cursiva y tamaño
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(nombre).width;
    const padding = 40;
    const boxHeight = 80;
    const x = canvas.width / 2;
    const y = canvas.height - 100;

    // Fondo blanco con bordes redondeados
    ctx.fillStyle = "white";
    roundRect(ctx, x - textWidth / 2 - padding / 2, y - boxHeight / 2, textWidth + padding, boxHeight, 5);
    ctx.fill();

    // Texto negro encima
    ctx.fillStyle = "black";
    ctx.fillText(nombre, x, y);
  }
}

// Función para dibujar un rectángulo con esquinas redondeadas
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
