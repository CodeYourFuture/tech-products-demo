FROM node:20-alpine

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=4212
EXPOSE 4212

ENTRYPOINT [ "node" ]
CMD [ "./server.mjs" ]
