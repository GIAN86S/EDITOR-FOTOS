const uploadImage = document.getElementById('upload-image');
const imageCanvas = document.getElementById('image-canvas');
const downloadButton = document.getElementById('download-button');
const ctx = imageCanvas.getContext('2d');

let userImage = new Image();
const frameImage = new Image();
frameImage.src = 'assets/marco.png'; // Asegúrate de que 'marco.png' esté en la carpeta 'assets'

let isDragging = false;
let startX, startY;
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function drawImageOnCanvas() {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    // Dibujar la imagen del usuario ajustada
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = offsetX + (imageCanvas.width - scaledWidth) / 2;
    const y = offsetY + (imageCanvas.height - scaledHeight) / 2;
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);

    // Dibujar el marco PNG encima
    ctx.drawImage(frameImage, 0, 0, imageCanvas.width, imageCanvas.height);
}

uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            userImage.onload = function() {
                // Asegurar relación 1:1 y ajustar tamaño inicial del canvas
                const size = Math.min(userImage.width, userImage.height);
                imageCanvas.width = size;
                imageCanvas.height = size;
                scale = 1;
                offsetX = 0;
                offsetY = 0;
                drawImageOnCanvas();
                downloadButton.disabled = false;
            }
            userImage.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});

frameImage.onload = () => {
    // Asegurarse de que el marco se dibuje incluso si no se ha cargado una imagen aún
    if (userImage.src) {
        drawImageOnCanvas();
    }
};

// Interacciones para escritorio (arrastrar y zoom con rueda)
imageCanvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    imageCanvas.style.cursor = 'grab';
});

imageCanvas.addEventListener('mouseup', () => {
    isDragging = false;
    imageCanvas.style.cursor = 'default';
});

imageCanvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    drawImageOnCanvas();
});

imageCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.05;
    const scaleFactor = e.deltaY > 0 ? (1 - zoomSpeed) : (1 + zoomSpeed);
    scale *= scaleFactor;
    drawImageOnCanvas();
});

// Interacciones para dispositivos móviles (táctiles)
let initialPinchDistance = null;
let initialScale = scale;

imageCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = scale;
    } else if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - offsetX;
        startY = e.touches[0].clientY - offsetY;
    }
});

imageCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && initialPinchDistance !== null) {
        const currentPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        scale = initialScale * (currentPinchDistance / initialPinchDistance);
        drawImageOnCanvas();
    } else if (e.touches.length === 1 && isDragging) {
        offsetX = e.touches[0].clientX - startX;
        offsetY = e.clientY - startY;
        drawImageOnCanvas();
    }
});

imageCanvas.addEventListener('touchend', () => {
    initialPinchDistance = null;
    isDragging = false;
});

downloadButton.addEventListener('click', () => {
    // Crear un canvas temporal para la descarga con resolución máxima
    const downloadCanvas = document.createElement('canvas');
    const downloadSize = Math.min(Math.max(userImage.width * scale, userImage.height * scale), 1920);
    downloadCanvas.width = downloadSize;
    downloadCanvas.height = downloadSize;
    const downloadCtx = downloadCanvas.getContext('2d');

    // Calcular la posición para centrar la imagen escalada
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = (downloadSize - scaledWidth) / 2 + offsetX * (downloadSize / imageCanvas.width);
    const y = (downloadSize - scaledHeight) / 2 + offsetY * (downloadSize / imageCanvas.height);

    downloadCtx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    downloadCtx.drawImage(frameImage, 0, 0, downloadSize, downloadSize);

    const dataURL = downloadCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'recuerdo_congresista.png'; // Cambiar el nombre del archivo de descarga
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
