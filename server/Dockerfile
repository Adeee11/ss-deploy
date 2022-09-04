FROM node:16.16.0-alpine3.15

WORKDIR /srv/app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

VOLUME [ "/srv/app/downloads", "/srv/app/html" ]

ENV NODE_ENV=production


RUN yarn build


CMD ["yarn", "start"]