# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Nest.js application
RUN npm run build

# Expose the Nest.js port
EXPOSE 3000

# Default command (development with hot-reloading)
CMD ["npm", "run", "start:dev"]
