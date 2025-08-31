# fuel-logger

## Installation

1. Install backend dependencies:
   ```bash
   npm install --prefix backend
   ```
2. (Optional) Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```

## Environment Variables

Copy `.env.example` to `.env` and provide values for:

- `OPENAI_API_KEY` – OpenAI API key used to parse receipt images.
- `GOOGLE_CLIENT_EMAIL` – service-account email for the Google Sheets API.
- `GOOGLE_PRIVATE_KEY` – service-account private key (replace newline characters with `\n`).
- `GOOGLE_SHEET_ID` – ID of the target Google Sheet.
- `PORT` – (optional) port the server listens on; defaults to `3000`.

## Running the Server

Start the backend server:

```bash
npm start --prefix backend
```

The server hosts the static frontend and exposes a `POST /entries` endpoint for uploading receipt images.

## Receipt Parsing Workflow

1. The frontend form uploads an image of a fuel receipt along with odometer details.
2. `multer` stores the upload on disk.
3. `parseReceipt` (using OpenAI) extracts `litres`, `price_per_litre`, and `total_cost` from the image.
4. `appendFuelRow` appends the parsed data to the configured Google Sheet.
   Rows are written in the following column order:
   Date, Station, Litres, Price/L, Total Cost, GST, Odometer, Trip Odometer.

## Google API Setup

1. In the [Google Cloud Console](https://console.cloud.google.com), create a project and enable the **Google Sheets API**.
2. Create a service account and generate a JSON key.
3. Populate `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` in `.env` from the key file.
4. Share the target Google Sheet with the service-account email and set `GOOGLE_SHEET_ID` accordingly.

