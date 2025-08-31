const { google } = require('googleapis');

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

async function appendFuelRow({
  timestamp,
  station = '',
  litres,
  price_per_litre,
  total_cost,
  gst = '',
  odometer,
  trip_odometer
}) {
  const values = [[
    timestamp,
    station,
    litres,
    price_per_litre,
    total_cost,
    gst,
    odometer,
    trip_odometer
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  });
}

module.exports = { appendFuelRow };

