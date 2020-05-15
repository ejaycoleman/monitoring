FROM node:10.16.0
RUN npm install -g prisma
RUN npm install -g nodemon

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN prisma generate