const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let imagen = null;
let fotoUsuario = new Image();
let marco = new Image();
let marcoCargado = false;
marco.src = "assets/marco.png";

let offsetX = 0;
let offsetY = 0;
let escala = 1;
let arrastrando = false;
let inicioX, inicioY;

// Asegúrate de que el marco esté cargado antes de dibujar
marco.onload = () => {
  marcoCargado = true;
  dibujar();
};

// Subir imagen
document.getElementById("imagen").addEventListener("change", (e) => {
  const archivo = e.target.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function (event) {
      fotoUsuario = new Image();
      fotoUsuario.onload = function () {
        offsetX = (canvas.width - fotoUsuario.width) / 2;
        offsetY = (canvas.height - fotoUsuario.height) / 2;
        escala = 1;
        dibujar();
        mostrarMensaje("Imagen subida. Puedes mover y acomodar la imagen.");
      };
      fotoUsuario.src = event.target.result;
    };
    lector.readAsDataURL(archivo);
  }
});

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Imagen del usuario
  if (fotoUsuario.src && fotoUsuario.complete) {
    ctx.drawImage(
      fotoUsuario,
      offsetX,
      offsetY,
      fotoUsuario.width * escala,
      fotoUsuario.height * escala
    );
  }

  // Marco encima de la imagen
  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);

  // Texto del nombre
  const nombre = document.getElementById("nombre").value.toUpperCase();
  if (nombre) {
    ctx.font = "bold italic 75px sans-serif"; // Aumenta el tamaño y hace el texto más grueso
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(nombre).width;
    const padding = 40;
    const boxHeight = 80;
    const x = canvas.width / 2;
    const y = canvas.height - 700;

    // Fondo blanco con esquinas redondeadas
    ctx.fillStyle = "white";
    roundRect(
      ctx,
      x - textWidth / 2 - padding / 2,
      y - boxHeight / 2,
      textWidth + padding,
      boxHeight,
      10
    );
    ctx.fill();

    // Texto encima
    ctx.fillStyle = "black";
    ctx.fillText(nombre, x, y);
  }
}

// Función para dibujar bordes redondeados
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

// Descargar imagen
document.getElementById("descargar").addEventListener("click", () => {
  const confirmacion = confirm("Te vamos a redirigir a un formulario de Google para terminar el proceso.");
  if (confirmacion) {
    const link = document.createElement("a");
    link.download = "soy_congresista.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    setTimeout(() => {
      window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScADVWa0UdVU037NE1UwkhS2RH529WnIFmWOfeX64XIuj6nLw/viewform?usp=dialog";
    }, 2000);
  }
});

// Mostrar mensaje flotante
function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje-flotante");
  mensaje.textContent = texto;
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000);
}

// Eventos para mover la imagen
canvas.addEventListener("mousedown", (e) => {
  if (e.offsetX > offsetX && e.offsetX < offsetX + fotoUsuario.width * escala &&
      e.offsetY > offsetY && e.offsetY < offsetY + fotoUsuario.height * escala) {
    arrastrando = true;
    inicioX = e.offsetX - offsetX;
    inicioY = e.offsetY - offsetY;
  }
});

canvas.addEventListener("mouseup", () => {
  arrastrando = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (arrastrando) {
    offsetX = e.offsetX - inicioX;
    offsetY = e.offsetY - inicioY;
    dibujar();
  }
});

// Evento de zoom con la rueda del ratón
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  escala += e.deltaY < 0 ? 0.05 : -0.05;
  escala = Math.max(0.1, escala);
  dibujar();
});

// Actualizar canvas al cambiar el nombre
document.getElementById("nombre").addEventListener("input", dibujar);
