FROM node:24.13.1-alpine3.22 AS build

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci

COPY . .

RUN npm run build

RUN npm prune --omit=dev

FROM node:24.13.1-alpine3.22 AS production

WORKDIR /app

ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256 --no-warnings" \
    NPM_CONFIG_LOGLEVEL=silent

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]