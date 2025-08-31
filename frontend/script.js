const form = document.getElementById('fuel-form');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const notification = document.getElementById('notification');

function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.style.backgroundColor = isError ? '#cf6679' : '#03dac6';
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.innerHTML = '';
  loading.style.display = 'block';

  const formData = new FormData(form);

  try {
    const response = await fetch('/entries', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    result.innerHTML = `
      <p>Station: ${data.station}</p>
      <p>Litres: ${data.litres}</p>
      <p>Price per litre: ${data.price_per_litre}</p>
      <p>Total cost: ${data.total_cost}</p>
      <p>GST: ${data.gst}</p>
    `;
    showNotification('Entry submitted successfully');
  } catch (err) {
    showNotification(err.message, true);
  } finally {
    loading.style.display = 'none';
  }
});
