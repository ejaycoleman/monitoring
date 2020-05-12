FROM node:10.16.0
RUN npm install -g prisma

RUN mkdir /app
WORKDIR /app

COPY ./ ./prisma/

CMD [ "prisma", "deploy"]