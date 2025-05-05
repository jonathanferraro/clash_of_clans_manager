# Use an appropriate Node.js version (e.g., LTS - check Railway docs/Node docs if unsure)
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# Use --only=production if you don't need devDependencies to run the app
# RUN npm install --only=production
RUN npm install

# Copy the rest of your application code
COPY . .

# ** Run the build script to compile TypeScript to JavaScript **
RUN npm run build

# Expose the port your app runs on (change if necessary)
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "start" ]