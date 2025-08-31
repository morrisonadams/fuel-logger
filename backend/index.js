const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
// Environment variables loaded from `.env`:
// - OPENAI_API_KEY: auth token for OpenAI API used in services/openai.js
// - GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY: credentials for Google Sheets API
// - GOOGLE_SHEET_ID: target spreadsheet for append operations

const express = require('express');
const multer = require('multer');
const { parseReceipt } = require('./services/openai');
const { appendFuelRow } = require('./services/googleSheets');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure file uploads
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Handle form submissions
app.post('/entries', upload.single('photo'), async (req, res) => {
  const { odometer, tripOdometer } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const imagePath = path.join(__dirname, 'uploads', photo);
    const parsed = await parseReceipt(imagePath);

    await appendFuelRow({
      timestamp: new Date().toISOString(),
      station: '',
      litres: parsed.litres,
      price_per_litre: parsed.price_per_litre,
      total_cost: parsed.total_cost,
      gst: '',
      odometer,
      trip_odometer: tripOdometer
    });

    res.json({
      odometer,
      tripOdometer,
      photo,
      ...parsed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
