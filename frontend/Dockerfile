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

# Копируем код
COPY . .

# Проверяем содержимое рабочей директории
RUN echo "Listing files before build:" && ls -la && pwd

# Выполняем сборку
RUN npm run build

# Проверяем наличие и содержимое папки .next после сборки
RUN echo "Listing .next directory after build:" && ls -la .next || echo ".next directory not found"

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

# Проверяем наличие папки .next в runner
RUN echo "Listing .next directory in runner:" && ls -la .next || echo ".next directory not found in runner"

# Открываем порт Next.js
EXPOSE 3000

# Стартуем сервер
CMD ["npm", "start"]