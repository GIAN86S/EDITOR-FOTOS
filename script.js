const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const downloadBtn = document.getElementById("download");
const info = document.getElementById("info");

const marco = new Image();
marco.src = "assets/marco.png"; // Tu marco de 1920x1920

let fotoUsuario = new Image();
let escala = 1;
let offsetX = 0;
let offsetY = 0;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.match(/^image\/(png|jpeg|jpg)$/)) {
    alert("Por favor sube una imagen JPG, JPEG o PNG.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    fotoUsuario = new Image();
    fotoUsuario.onload = () => {
      escala = Math.min(canvas.width / fotoUsuario.width, canvas.height / fotoUsuario.height);
      offsetX = (canvas.width - fotoUsuario.width * escala) / 2;
      offsetY = (canvas.height - fotoUsuario.height * escala) / 2;
      info.style.display = "block";
      dibujar();
    };
    fotoUsuario.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  escala += e.deltaY * -0.001;
  escala = Math.min(Math.max(0.1, escala), 5);
  dibujar();
});

let isDragging = false;
let startX, startY;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  offsetX += e.offsetX - startX;
  offsetY += e.offsetY - startY;
  startX = e.offsetX;
  startY = e.offsetY;
  dibujar();
});

canvas.addEventListener("mouseup", () => (isDragging = false));
canvas.addEventListener("mouseleave", () => (isDragging = false));

downloadBtn.addEventListener("click", () => {
  const enlace = document.createElement("a");
  enlace.download = "foto_con_marco.png";
  enlace.href = canvas.toDataURL("image/png");
  enlace.click();
});

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fotoUsuario.src && fotoUsuario.complete) {
    const w = fotoUsuario.width * escala;
    const h = fotoUsuario.height * escala;

    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.drawImage(fotoUsuario, offsetX, offsetY, w, h);
    ctx.restore();

    // Guía visual
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 3;
    ctx.strokeRect(offsetX, offsetY, w, h);
    ctx.restore();
  }

  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}
