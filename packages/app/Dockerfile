# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos
COPY package*.json ./
COPY packages/app/package*.json ./packages/app/
COPY packages/app/index.html ./packages/app/
COPY tsconfig*.json ./
COPY packages/app/tsconfig*.json ./packages/app/
COPY packages/app/vite.config.ts ./packages/app/

# Instalar dependências
RUN npm install --workspace=monorepo-app

# Copiar código fonte
COPY packages/app/src ./packages/app/src
COPY packages/app/tests ./packages/app/tests

# Build (o dist vai para /app/dist/app)
RUN npm run build -w packages/app

# Production stage (nginx)
FROM nginx:alpine

# Copiar build da raiz (dist/app)
COPY --from=builder /app/dist/app /usr/share/nginx/html
COPY packages/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]