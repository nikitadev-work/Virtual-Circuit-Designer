# Этап сборки
FROM node:18-alpine AS builder

# Устанавливаем зависимости и кэшируем их отдельным слоем
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && \
    apk add --no-cache libc6-compat curl

# Копируем остальные файлы и собираем проект
COPY . .
RUN npm run build

# Этап рантайма
FROM node:18-alpine AS runner
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
