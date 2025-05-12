const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('imagen');
const nameInput = document.getElementById('nombre');
const downloadBtn = document.getElementById('descargar');
const mensajeFlotante = document.getElementById('mensaje');

canvas.width = 1920;
canvas.height = 1920;

let image = new Image();
let frame = new Image();
frame.src = 'marco.png'; // Asegúrate de tener este archivo

let imageLoaded = false;
let imageX = 0;
let imageY = 0;
let imageScale = 1;
let isDragging = false;
let lastX, lastY;

// Redibujar todo en el canvas
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (imageLoaded) {
    const iw = image.width * imageScale;
    const ih = image.height * imageScale;
    ctx.drawImage(image, imageX, imageY, iw, ih);
  }

  // Dibujar el texto del nombre
  const name = nameInput.value.toUpperCase();
  if (name) {
    ctx.font = 'italic 60px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    const textWidth = ctx.measureText(name).width;
    const textX = canvas.width / 2;
    const textY = canvas.height - 80;

    // Fondo del texto
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(textX - textWidth / 2 - 20, textY - 60, textWidth + 40, 70, 5);
    ctx.fill();

    // Texto
    ctx.fillStyle = 'black';
    ctx.fillText(name, textX, textY - 10);
  }

  // Dibujar el marco encima
  if (frame.complete) {
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }
}

// Soporte para esquinas redondeadas (custom)
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};

// Cargar imagen seleccionada
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Cuando la imagen se carga
image.onload = function () {
  imageLoaded = true;
  const scaleFactor = Math.min(canvas.width / image.width, canvas.height / image.height);
  imageScale = scaleFactor;
  imageX = (canvas.width - image.width * imageScale) / 2;
  imageY = (canvas.height - image.height * imageScale) / 2;
  drawCanvas();
  downloadBtn.disabled = false;
};

// Actualizar texto en tiempo real
nameInput.addEventListener('input', drawCanvas);

// Descargar la imagen final
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'imagen_final.png';
  link.href = canvas.toDataURL();
  link.click();

  // Mostrar mensaje
  mensajeFlotante.innerText = 'Imagen descargada con éxito';
  mensajeFlotante.style.display = 'block';
  setTimeout(() => {
    mensajeFlotante.style.display = 'none';
  }, 3000);
});

// Eventos de arrastre para mover la imagen
canvas.addEventListener('mousedown', e => {
  if (!imageLoaded) return;
  isDragging = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener('mousemove', e => {
  if (!isDragging || !imageLoaded) return;
  const dx = e.offsetX - lastX;
  const dy = e.offsetY - lastY;
  imageX += dx;
  imageY += dy;
  lastX = e.offsetX;
  lastY = e.offsetY;
  drawCanvas();
});
canvas.addEventListener('mouseup', () => {
  isDragging = false;
});
canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Zoom con la rueda del mouse
canvas.addEventListener('wheel', e => {
  if (!imageLoaded) return;
  e.preventDefault();
  const zoomFactor = 1.1;
  const oldScale = imageScale;
  imageScale *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

  // Recalcular posición para mantener el centro
  const mx = e.offsetX;
  const my = e.offsetY;
  imageX = mx - ((mx - imageX) * imageScale) / oldScale;
  imageY = my - ((my - imageY) * imageScale) / oldScale;

  drawCanvas();
});
