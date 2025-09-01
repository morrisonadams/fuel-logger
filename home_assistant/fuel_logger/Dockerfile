FROM ghcr.io/home-assistant/base:latest

# Install Node.js
RUN apt-get update \
    && apt-get install -y nodejs npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend /app/backend
COPY frontend /app/frontend
RUN npm --prefix backend install \
    && npm --prefix frontend install

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 3000
CMD ["/run.sh"]
