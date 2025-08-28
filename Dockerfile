FROM node:18

WORKDIR /app

# Install backend deps
COPY backend/package*.json backend/
RUN npm install --prefix backend

# Install frontend deps
COPY frontend/package*.json frontend/
RUN npm install --prefix frontend

# Copy the rest of the code
COPY . .

CMD ["npm", "--prefix", "backend", "start"]
