# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json .

# Install dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Expose port
EXPOSE 5173

# Run the app
CMD ["npm", "run", "dev"]


