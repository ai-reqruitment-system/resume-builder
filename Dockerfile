# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose the default port (optional, can be overwritten)
EXPOSE 3000

# Use dynamic port
CMD sh -c "serve -s build -l ${PORT:-3000}"