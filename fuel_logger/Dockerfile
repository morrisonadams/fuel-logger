ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
FROM ${BUILD_FROM}

# Install Node.js
RUN apt-get update \
    && apt-get install -y nodejs npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend /app/backend
COPY frontend /app/frontend
RUN npm --prefix backend install \
    && npm --prefix frontend install

COPY fuel_logger/run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 3000
CMD ["/run.sh"]
