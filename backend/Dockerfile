FROM node:10.16.0
RUN npm install -g prisma

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN prisma generate

CMD [ "npm", "start" ]