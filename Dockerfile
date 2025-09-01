FROM node:18

WORKDIR /app

# Install backend deps
COPY fuel_logger/backend/package*.json fuel_logger/backend/
RUN npm install --prefix fuel_logger/backend

# Install frontend deps
COPY fuel_logger/frontend/package*.json fuel_logger/frontend/
RUN npm install --prefix fuel_logger/frontend

# Copy the rest of the code
COPY . .

EXPOSE 3000
CMD ["npm", "--prefix", "fuel_logger/backend", "start"]
