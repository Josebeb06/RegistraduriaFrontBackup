# ============================================================
# ETAPA 1: Build de Angular (CSR, sin SSR)
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instala dependencias primero (caching de layers)
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

# Copia el codigo fuente y compila en modo produccion
COPY . .
RUN npm run build

# ============================================================
# ETAPA 2: Nginx sirviendo los archivos estaticos + API Gateway
# ============================================================
FROM nginx:alpine AS production

# Copia los archivos compilados de Angular
COPY --from=builder /app/dist/portal-privado/browser /usr/share/nginx/html

# Copia la configuracion de Nginx (API gateway + SPA routing)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
