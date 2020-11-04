FROM node:14-alpine
WORKDIR /build

COPY package.json package-lock.json tsconfig.json ./
RUN npm install

COPY src src
RUN npm run build

FROM node:14-alpine
WORKDIR /app

ENV NODE_ENV=production
COPY persist persist
COPY .env ./
COPY --from=0 /build/node_modules ./node_modules
COPY --from=0 /build/dist ./


CMD node --unhandled-rejections=strict -r source-map-support/register index.js
