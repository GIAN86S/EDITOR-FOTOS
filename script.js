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
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleAmount = 0.05;
  escala += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  escala = Math.max(0.1, escala);
  dibujar();
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

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fotoUsuario.src && fotoUsuario.complete) {
    const w = fotoUsuario.width * escala;
    const h = fotoUsuario.height * escala;

    ctx.drawImage(fotoUsuario, offsetX, offsetY, w, h);

    // Guía de recorte
    ctx.save();
    ctx.strokeStyle = "rgba(0, 128, 255, 0.8)";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(offsetX, offsetY, w, h);
    ctx.restore();

    // Líneas guía cruzadas
    ctx.save();
    ctx.strokeStyle = "rgba(0, 128, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX + w / 2, offsetY);
    ctx.lineTo(offsetX + w / 2, offsetY + h);
    ctx.moveTo(offsetX, offsetY + h / 2);
    ctx.lineTo(offsetX + w, offsetY + h / 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}
