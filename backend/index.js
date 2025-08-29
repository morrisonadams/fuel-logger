const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure file uploads
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Handle form submissions
app.post('/entries', upload.single('photo'), (req, res) => {
  const { odometer, tripOdometer } = req.body;
  const photo = req.file ? req.file.filename : null;
  res.json({ message: 'Entry received', odometer, tripOdometer, photo });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
