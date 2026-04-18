# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run with Node (SSR)
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist/portal-privado ./dist/portal-privado
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/portal-privado/server/server.mjs"]
