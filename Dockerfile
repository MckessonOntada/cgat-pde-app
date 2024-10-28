# Pull the Node.js Docker image
FROM node:18-alpine AS build

# Set environment variable for npm token
ARG NPM_TOKEN

# Configure npm to use GitHub Package Registry
RUN npm config set @mckesson-ontada:registry https://npm.pkg.github.com
RUN npm config set @mckesson:registry https://npm.pkg.github.com/mckesson
RUN npm config set "//npm.pkg.github.com/:_authToken" ${NPM_TOKEN}

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files (if using Yarn)
COPY package.json package-lock.json ./

# Install build dependencies
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
# Install Yarn globally
#RUN npm install -g yarn

# Install dependencies using Yarn
# RUN yarn install¿

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "start"]
