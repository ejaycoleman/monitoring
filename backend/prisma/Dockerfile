FROM node:10.16.0
RUN npm install -g @prisma/cli
RUN mkdir /app
WORKDIR /app
COPY ./ ./prisma/
CMD prisma studio --experimental