FROM node:12.14.1-slim
RUN apt-get -qy update && apt-get -qy install openssl
RUN npm install @prisma/cli

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ARG MYSQL_URL
ENV MYSQL_URL "mysql://root:prisma@mysql:3306/prisma"

RUN npm install
RUN npx prisma generate

CMD ["npm", "start" ]