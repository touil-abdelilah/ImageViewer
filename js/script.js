lucide.createIcons();

let image = document.getElementById('image');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let currentRotation = 0;

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('drop-area').addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

document.getElementById('drop-area').addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    document.getElementById('fileInput').files = e.dataTransfer.files;
    handleFile({ target: { files: e.dataTransfer.files } });
  }
});

function handleFile(e) {
  const file = e.target.files[0];
  if (!file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    image.src = evt.target.result;
    image.onload = () => {
      currentRotation = 0;
      drawToCanvas();
    };
  };
  reader.readAsDataURL(file);
}

function drawToCanvas() {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const angle = currentRotation * (Math.PI / 180);

  if (currentRotation % 180 === 0) {
    canvas.width = w;
    canvas.height = h;
  } else {
    canvas.width = h;
    canvas.height = w;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -w / 2, -h / 2);
  ctx.restore();

  image.src = canvas.toDataURL();
}

function rotateImage(degrees) {
  currentRotation = (currentRotation + degrees) % 360;
  drawToCanvas();
}

const languageSelect = document.getElementById('lang-select');

function extractText() {
  const lang = languageSelect.value || 'eng';
  // ...
  Tesseract.recognize(image.src, lang, {
    logger: m => { /* same as before */ }
  }).then(({ data: { text } }) => {
    // ...
  });
}
