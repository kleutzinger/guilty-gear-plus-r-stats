FROM node:16-alpine

ARG PGUSER=${PGUSER}
ARG PGHOST=${PGHOST}
ARG PGPASSWORD=${PGPASSWORD}
ARG PGDATABASE=${PGDATABASE}
ARG PGPORT=${PGPORT}

WORKDIR /app

COPY requirements.txt package.json yarn.lock ./

RUN yarn --frozen-lockfile
RUN apk add --no-cache python3 py3-pip make gcc g++
RUN python3 -m pip install -r requirements.txt

COPY . .

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD yarn start
