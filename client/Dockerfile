# Use an official Node.js runtime as the base image
FROM node:23-slim

# Set the working directory to /app inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 4173

# Run the application
CMD ["npm", "run", "start"]
