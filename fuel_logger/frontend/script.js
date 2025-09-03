const form = document.getElementById('fuel-form');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');
const cameraInput = document.getElementById('camera-photo');
const galleryInput = document.getElementById('gallery-photo');
const takePhotoButton = document.getElementById('take-photo');
const uploadPhotoButton = document.getElementById('upload-photo');

function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.style.backgroundColor = isError ? '#cf6679' : '#03dac6';
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

async function handleSubmit(e) {
  e.preventDefault();
  loading.style.display = 'block';

  const formData = new FormData(form);

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

form.addEventListener('submit', handleSubmit);

takePhotoButton.addEventListener('click', async () => {
  if (navigator.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.top = '-10000px';
      document.body.appendChild(video);
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      stream.getTracks().forEach((track) => track.stop());
      video.remove();

      canvas.toBlob((blob) => {
        if (!blob) {
          showNotification('Unable to capture photo', true);
          return;
        }
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        cameraInput.files = dt.files;
        form.requestSubmit();
      }, 'image/jpeg');
    } catch (err) {
      cameraInput.click();
    }
  } else {
    cameraInput.click();
  }
});

uploadPhotoButton.addEventListener('click', () => {
  galleryInput.click();
});

[cameraInput, galleryInput].forEach((input) => {
  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      form.requestSubmit();
    }
  });
});
