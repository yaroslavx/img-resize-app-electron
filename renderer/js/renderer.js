const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

const loadImage = (e) => {
  const file = e.target.files[0];
  if (!isFileImg(file)) {
    alertError('It is not an image');
    return;
  }

  // Get original dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), 'resizedImage');
  alertSuccess('Nice image');
};

// Check file is img
const isFileImg = (file) => {
  const acceptedImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  return file && acceptedImageTypes.includes(file['type']);
};

// Send image data to main
const sendImage = (e) => {
  e.preventDefault();

  if (!img.files[0]) {
    alertError('Upload image');
    return;
  }

  const width = widthInput.value;
  const height = heightInput.value;

  if (width === '' && height === '') {
    alertError('Set height and wigth');
    return;
  }

  const imgPath = img.files[0].path;

  // Send to main using ipcRenderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  });
};

// Catch the image:done event
ipcRenderer.on('image:done', () => {
  alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
});

const alertError = (message) => {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
};

const alertSuccess = (message) => {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
};

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
