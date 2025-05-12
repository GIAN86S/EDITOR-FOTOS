// Referencias a elementos HTML
const input = document.getElementById("imagen");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marco = new Image();
marco.src = "assets/marco.png";

// Variables de imagen
let fotoUsuario = new Image();
let offsetX = 0, offsetY = 0, escala = 1;
let arrastrando = false;
let startX, startY;
let lastTouchDist = null;

// Al subir imagen
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
      mostrarMensajeFlotante("Imagen subida. Puedes mover y acomodar la imagen.");
      dibujar();
    };
    fotoUsuario.src = ev.target.result;
  };

  lector.readAsDataURL(archivo);
});

// Eventos para mover imagen con mouse
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

// Zoom con rueda del mouse
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleAmount = 0.1;
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  escala = Math.max(0.1, escala);
  dibujar();
});

// Gestos táctiles
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

// Función de distancia entre dos dedos
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Función de dibujo
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (fotoUsuario.src && fotoUsuario.complete) {
    ctx.drawImage(fotoUsuario, offsetX, offsetY, fotoUsuario.width * escala, fotoUsuario.height * escala);
  }
  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}

// Evento de descarga y alerta posterior
document.getElementById("descargar").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "imagen_con_marco.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  setTimeout(() => {
    mostrarAlertaPersonalizada();
  }, 1000);
});

// Muestra mensaje flotante básico
function mostrarMensajeFlotante(mensaje) {
  const mensajeDiv = document.getElementById("mensaje-flotante");
  mensajeDiv.innerText = mensaje;
  mensajeDiv.style.display = "block";
  setTimeout(() => mensajeDiv.style.display = "none", 3000);
}

// Muestra una alerta con botón OK
function mostrarAlertaPersonalizada() {
  const alerta = document.createElement("div");
  alerta.style.position = "fixed";
  alerta.style.top = "0";
  alerta.style.left = "0";
  alerta.style.width = "100vw";
  alerta.style.height = "100vh";
  alerta.style.backgroundColor = "rgba(0,0,0,0.7)";
  alerta.style.display = "flex";
  alerta.style.flexDirection = "column";
  alerta.style.justifyContent = "center";
  alerta.style.alignItems = "center";
  alerta.style.zIndex = "1000";

  const caja = document.createElement("div");
  caja.style.background = "white";
  caja.style.padding = "30px";
  caja.style.borderRadius = "15px";
  caja.style.textAlign = "center";
  caja.style.maxWidth = "90%";

  const mensaje = document.createElement("p");
  mensaje.innerText = "Te vamos a redirigir a un formulario Google para terminar el registro.";
  mensaje.style.color = "#000";
  mensaje.style.fontSize = "20px";
  mensaje.style.marginBottom = "20px";

  const boton = document.createElement("button");
  boton.innerText = "OK";
  boton.style.padding = "15px 40px";
  boton.style.fontSize = "18px";
  boton.style.backgroundColor = "#0067bc";
  boton.style.color = "white";
  boton.style.border = "none";
  boton.style.borderRadius = "10px";
  boton.style.cursor = "pointer";
  boton.onclick = () => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScADVWa0UdVU037NE1UwkhS2RH529WnIFmWOfeX64XIuj6nLw/viewform?usp=header";
  };

  caja.appendChild(mensaje);
  caja.appendChild(boton);
  alerta.appendChild(caja);
  document.body.appendChild(alerta);
}
