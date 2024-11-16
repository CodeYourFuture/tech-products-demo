FROM node:22-alpine

USER node
WORKDIR /home/node

COPY package.json ./
RUN npm install

COPY . .

ENV PORT=4212
EXPOSE 4212

ENTRYPOINT [ "node" ]
CMD [ "./server.mjs" ]
