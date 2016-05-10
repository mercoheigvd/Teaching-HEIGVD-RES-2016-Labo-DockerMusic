FROM node:latest

MAINTAINER Romain Mercier

COPY musician /opt/dockermusic

WORKDIR /opt/dockermusic

RUN npm install uuid

ENTRYPOINT ["node", "/opt/dockermusic/index.js"]