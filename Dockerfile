# Use official Node.js 20 image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port (Fly.io uses internal routing)
EXPOSE 8080

# Run the application
CMD [ "node", "index.js" ]
