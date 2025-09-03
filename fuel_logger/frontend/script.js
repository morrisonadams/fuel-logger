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

// Use the native camera capture interface so users can take a photo manually
takePhotoButton.addEventListener('click', () => {
  cameraInput.click();
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
