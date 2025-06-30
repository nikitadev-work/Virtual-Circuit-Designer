############### 1.  B U I L D E R  ###############
FROM node:20 AS builder
WORKDIR /app

# 1) ставим зависимости
COPY package*.json ./
RUN npm ci --force                           # reproducible install

# 2) копируем исходники и собираем
COPY . .
RUN npm run build                            # создаёт /app/build

############### 2.  R U N N E R  ###############
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# минимальный набор для запуска
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build        ./.next
COPY --from=builder /app/public       ./public

EXPOSE 3000
CMD ["npm", "start"]
