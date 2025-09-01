#!/usr/bin/with-contenv bashio
set -e

export OPENAI_API_KEY="$(bashio::config 'OPENAI_API_KEY')"
export GOOGLE_CLIENT_EMAIL="$(bashio::config 'GOOGLE_CLIENT_EMAIL')"
export GOOGLE_PRIVATE_KEY="$(bashio::config 'GOOGLE_PRIVATE_KEY')"
export GOOGLE_SHEET_ID="$(bashio::config 'GOOGLE_SHEET_ID')"
export PORT="$(bashio::config 'PORT')"

npm --prefix /app/backend start
