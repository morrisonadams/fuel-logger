const form = document.getElementById('fuel-form');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');
const galleryInput = document.getElementById('gallery-photo');
const takePhotoButton = document.getElementById('take-photo');
const uploadPhotoButton = document.getElementById('upload-photo');
const cameraModal = document.getElementById('camera-modal');
const cameraStream = document.getElementById('camera-stream');
const captureButton = document.getElementById('capture-btn');
const closeCameraButton = document.getElementById('close-camera');
let stream;

function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.style.backgroundColor = isError ? '#cf6679' : '#03dac6';
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

async function submitForm(photoBlob) {
  loading.style.display = 'block';

  const formData = new FormData();
  formData.append('odometer', form.odometer.value);
  formData.append('tripOdometer', form.tripOdometer.value);

  if (photoBlob) {
    formData.append('photo', photoBlob, 'photo.jpg');
  } else if (galleryInput.files[0]) {
    formData.append('photo', galleryInput.files[0]);
  }

  try {
    const response = await fetch('entries', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    showNotification('Entry submitted successfully');
    form.reset();
  } catch (err) {
    showNotification(err.message, true);
  } finally {
    loading.style.display = 'none';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm();
});

takePhotoButton.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
    cameraStream.srcObject = stream;
    await cameraStream.play();
    cameraModal.classList.add('show');
  } catch (err) {
    showNotification('Camera access denied', true);
  }
});

captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = cameraStream.videoWidth;
  canvas.height = cameraStream.videoHeight;
  canvas.getContext('2d').drawImage(cameraStream, 0, 0);
  canvas.toBlob((blob) => {
    stopCamera();
    submitForm(blob);
  }, 'image/jpeg');
});

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  cameraModal.classList.remove('show');
}

closeCameraButton.addEventListener('click', stopCamera);

uploadPhotoButton.addEventListener('click', () => {
  galleryInput.click();
});

galleryInput.addEventListener('change', () => {
  if (galleryInput.files.length > 0) {
    submitForm();
  }
});
