# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copiar arquivos do monorepo
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY tsconfig*.json ./
COPY apps/api/tsconfig*.json ./apps/api/

# Instalar dependências (apenas produção para o stage final)
RUN npm install --workspace=@monorepo/api

# Copiar código fonte (apenas src, sem testes)
COPY apps/api/src ./apps/api/src

# Build
RUN npm run build -w @monorepo/api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar apenas o necessário para produção
COPY --from=builder /app/dist/api/src ./dist/src
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# main.js está dentro de src
CMD ["node", "dist/src/main.js"]