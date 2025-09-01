ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
FROM ${BUILD_FROM}

# Install Node.js
RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY backend /app/backend
COPY frontend /app/frontend
RUN npm --prefix backend install \
    && npm --prefix frontend install

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 3000
ENTRYPOINT ["/init"]
CMD ["/run.sh"]
