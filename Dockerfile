FROM node:latest
WORKDIR /usr/src/echo-front

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 2500
ENTRYPOINT [ "node", "index.js" ]
