# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copiar arquivos
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/web/index.html ./apps/web/
COPY tsconfig*.json ./
COPY apps/web/tsconfig*.json ./apps/web/
COPY apps/web/vite.config.ts ./apps/web/

# Instalar dependências
RUN npm install --workspace=@monorepo/web

# Copiar código fonte
COPY apps/web/src ./apps/web/src
COPY apps/web/tests ./apps/web/tests

# Build (o dist vai para /app/dist/web)
RUN npm run build -w @monorepo/web

# Production stage (nginx)
FROM nginx:alpine

# Copiar build da raiz (dist/web)
COPY --from=builder /app/dist/web /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]