# Use an official Node runtime as a parent image
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

# Define the command to run your app
CMD [ "node", "server.js" ]