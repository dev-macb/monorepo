# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos do monorepo
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY tsconfig*.json ./
COPY packages/api/tsconfig*.json ./packages/api/

# Instalar dependências (apenas produção para o stage final)
RUN npm install --workspace=monorepo-api

# Copiar código fonte (apenas src, sem testes)
COPY packages/api/src ./packages/api/src

# Build
RUN npm run build -w packages/api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar apenas o necessário para produção
COPY --from=builder /app/dist/api/src ./dist/src
COPY --from=builder /app/packages/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# main.js está dentro de src
CMD ["node", "dist/src/main.js"]