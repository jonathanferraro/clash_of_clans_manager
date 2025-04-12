# Use an official Node.js runtime as the base image
FROM node:23-slim

# Set the working directory to /app inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the backend will run on (default 8080)
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start"]
