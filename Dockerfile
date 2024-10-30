# pull the Node.js Docker image
FROM node:20-alpine AS build
ARG NPM_TOKEN
RUN npm config set @mckesson-ontada:registry https://npm.pkg.github.com
RUN npm config set @mckesson:registry https://npm.pkg.github.com/mckesson
RUN npm config set "//npm.pkg.github.com/:_authToken" ${NPM_TOKEN}
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm i react-app-rewired
RUN npm install
RUN npm install -D webpack-cli sass-loader sass
COPY . .
RUN cd apps/cgat-pde
RUN npm run build
#RUN npm run build
CMD ["npm", "run", "start"]
