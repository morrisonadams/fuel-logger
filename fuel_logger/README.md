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

After starting the add-on, the backend listens on port `3001`. The UI is available
directly at `http://<homeassistant>:3001/` and is not embedded via Home Assistant's
ingress system.

To add a sidebar entry, create a [panel iframe](https://www.home-assistant.io/integrations/panel_iframe/)
in your Home Assistant configuration and include `allow: "camera; microphone"` so the
interface can access the device camera without prompting the user.

