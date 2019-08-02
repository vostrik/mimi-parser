FROM node:lts

WORKDIR /mimi-parser

COPY package*.json ./
COPY src ./src

RUN npm install --production

CMD npm run start
