// Referencias a elementos del DOM
const inputImagen = document.getElementById('imagen');
const inputNombre = document.getElementById('nombre');
const descargarBtn = document.getElementById('descargar');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables de imagen
let imagenCargada = null;
let marco = new Image();
marco.src = 'marco.png';

// Parámetros para mover y escalar imagen
let posX = 0, posY = 0, escala = 1;
let arrastrando = false;
let offsetX, offsetY;

// Desactiva el botón de descarga hasta que se cargue una imagen
descargarBtn.disabled = true;

// Cargar imagen desde input
inputImagen.addEventListener('change', (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      imagenCargada = img;
      // Centra la imagen
      escala = Math.min(canvas.width / img.width, canvas.height / img.height);
      posX = (canvas.width - img.width * escala) / 2;
      posY = (canvas.height - img.height * escala) / 2;
      descargarBtn.disabled = false;
      dibujar();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(archivo);
});

// Dibuja todo: imagen, texto, marco
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (imagenCargada) {
    ctx.drawImage(imagenCargada, posX, posY, imagenCargada.width * escala, imagenCargada.height * escala);
  }

  // Dibuja el nombre si existe
  const texto = inputNombre.value.toUpperCase();
  if (texto) {
    const padding = 10;
    ctx.font = 'italic 30px sans-serif';
    const textWidth = ctx.measureText(texto).width;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 40;

    const x = (canvas.width - boxWidth) / 2;
    const y = canvas.height - boxHeight - 20;

    // Caja blanca redondeada
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + boxWidth - 5, y);
    ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + 5);
    ctx.lineTo(x + boxWidth, y + boxHeight - 5);
    ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - 5, y + boxHeight);
    ctx.lineTo(x + 5, y + boxHeight);
    ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - 5);
    ctx.lineTo(x, y + 5);
    ctx.quadraticCurveTo(x, y, x + 5, y);
    ctx.closePath();
    ctx.fill();

    // Texto negro encima
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, canvas.width / 2, y + boxHeight / 2);
  }

  // Dibuja el marco encima de todo
  ctx.drawImage(marco, 0, 0, canvas.width, canvas.height);
}

// Evento input para nombre (dibuja en tiempo real)
inputNombre.addEventListener('input', dibujar);

// Movimiento de la imagen
canvas.addEventListener('mousedown', (e) => {
  if (!imagenCargada) return;
  arrastrando = true;
  offsetX = e.offsetX - posX;
  offsetY = e.offsetY - posY;
});
canvas.addEventListener('mousemove', (e) => {
  if (arrastrando) {
    posX = e.offsetX - offsetX;
    posY = e.offsetY - offsetY;
    dibujar();
  }
});
canvas.addEventListener('mouseup', () => arrastrando = false);
canvas.addEventListener('mouseleave', () => arrastrando = false);

// Rueda para hacer zoom
canvas.addEventListener('wheel', (e) => {
  if (!imagenCargada) return;
  e.preventDefault();
  const zoom = e.deltaY < 0 ? 1.05 : 0.95;
  escala *= zoom;
  dibujar();
});

// Botón de descargar imagen final
descargarBtn.addEventListener('click', () => {
  const enlace = document.createElement('a');
  enlace.download = 'imagen_final.png';
  enlace.href = canvas.toDataURL();
  enlace.click();
});

// ✋ Bloquear clic derecho y algunas teclas para evitar capturas
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => {
  if (['PrintScreen', 'F12', 'Control', 'Shift', 'I'].includes(e.key)) {
    e.preventDefault();
  }
});
