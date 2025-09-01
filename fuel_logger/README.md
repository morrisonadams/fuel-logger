# Fuel Logger Home Assistant Add-on

This add-on wraps the Fuel Logger application so it can run under Home Assistant.

## Installation

1. Copy the `fuel_logger` folder into your Home Assistant `addons` directory
   or add this repository as a custom add-on repository.
2. Refresh the add-on store and install **Fuel Logger**.

## Configuration

Set the following options in the add-on configuration:

- `OPENAI_API_KEY` – API key from [OpenAI](https://platform.openai.com/).
- `GOOGLE_CLIENT_EMAIL` – Service account client email from Google Cloud.
- `GOOGLE_PRIVATE_KEY` – Private key for the service account.
- `GOOGLE_SHEET_ID` – ID of the Google Sheet used to store entries.

## Obtaining API Keys

1. **OpenAI**: Create an account at the OpenAI dashboard and generate an API key.
2. **Google Sheets**: Create a service account in Google Cloud, enable the Sheets API, and
   download the JSON credentials. Use the client email and private key values above. Share
   the target spreadsheet with the service account email.

## Usage

After starting the add-on, the backend listens on port `3000`. The frontend files are
served by the backend and are exposed inside Home Assistant via an ingress panel.
The **Fuel Logger** icon appears in the sidebar; click it to open the UI within
Home Assistant. You can still reach the interface externally at
`http://<homeassistant>:3000/` if you mapped the port.

