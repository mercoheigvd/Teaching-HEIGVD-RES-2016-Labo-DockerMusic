FROM node:latest

MAINTAINER Romain Mercier

COPY auditor /opt/dockermusic

WORKDIR /opt/dockermusic

RUN npm install moment

ENTRYPOINT ["node", "/opt/dockermusic/index.js"]