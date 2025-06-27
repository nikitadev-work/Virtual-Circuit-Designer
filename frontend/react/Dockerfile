# Этап сборки - используем Node 20
FROM node:20-alpine AS builder

# Устанавливаем зависимости и кэшируем их отдельным слоем
WORKDIR /app
COPY package.json package-lock.json ./

# Устанавливаем все зависимости (включая devDependencies)
RUN npm ci --include=dev && \
    apk add --no-cache libc6-compat curl

# Копируем остальные файлы и собираем проект
COPY . .

# Увеличиваем память для Next.js и запускаем сборку
RUN node --max_old_space_size=4096 node_modules/.bin/next build

# Этап рантайма
FROM node:20-alpine AS runner
WORKDIR /app

# Устанавливаем только необходимые для рантайма пакеты
RUN apk add --no-cache curl

# Настройки окружения
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Копируем только необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Оптимизация прав доступа
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]