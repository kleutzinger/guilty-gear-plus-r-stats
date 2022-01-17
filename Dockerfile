FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD yarn start
