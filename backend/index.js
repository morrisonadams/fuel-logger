const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend server');
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
