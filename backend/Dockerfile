FROM node:10.16.0
RUN npm install @prisma/client @prisma/cli typescript ts-node @types/node --save-dev
RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install