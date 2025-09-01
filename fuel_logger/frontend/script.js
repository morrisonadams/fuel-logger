const form = document.getElementById('fuel-form');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');

function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.style.backgroundColor = isError ? '#cf6679' : '#03dac6';
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

form.addEventListener('submit', async (e) => {
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
  } catch (err) {
    showNotification(err.message, true);
  } finally {
    loading.style.display = 'none';
  }
});
