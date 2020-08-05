FROM node:12.14.1-slim
RUN apt-get -qy update && apt-get -qy install openssl
RUN npm install -g @prisma/cli

RUN mkdir /app
WORKDIR /app

COPY ./ ./prisma/

CMD prisma studio --experimental