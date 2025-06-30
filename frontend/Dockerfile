############################################
# 1) Builder: собираем Next.js
############################################
FROM node:20 AS builder

WORKDIR /app

# Устанавливаем зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential python3 curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Копируем package.json и package-lock.json
COPY package*.json ./
RUN npm install --force

# Копируем код и выполняем сборку
COPY . .
RUN npm run build

############################################
# 2) Runner: запускаем Next.js
############################################
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Копируем необходимые файлы из builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Открываем порт Next.js
EXPOSE 3000

# Стартуем сервер
CMD ["npm", "start"]