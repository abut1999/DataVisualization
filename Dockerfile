FROM node:lts-alpine3.11 as builder
COPY . /home/node/app
WORKDIR /home/node/app
RUN apk add --no-cache python make g++
RUN npm install

FROM node:lts-alpine3.11 as app
USER node
COPY --chown=node:node --from=builder /home/node/app /home/node/app/
WORKDIR /home/node/app
ENV NODE_ENV production
EXPOSE 4000
CMD [ "npm", "start" ]
