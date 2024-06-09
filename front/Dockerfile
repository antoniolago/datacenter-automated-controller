FROM node:21-alpine

WORKDIR /app
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Instalando dependências da aplicação e armazenando em cache, quando o checksum do package.json mudar, ele irá ser reinstalado.
COPY package*.json ./
COPY *.lock ./
RUN yarn install  --network-timeout 1000000000 --verbose

CMD ["yarn", "start"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]