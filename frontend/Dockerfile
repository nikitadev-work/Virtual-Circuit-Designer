################# 1.  B U I L D E R #################
FROM node:20 AS builder
WORKDIR /app

# 1. Устанавливаем все зависимости (dev+prod)
COPY package*.json ./
RUN npm ci --force            # быстро и воспроизводимо

# 2. Копируем исходники и собираем Next.js
COPY . .
RUN npm run build             # создаёт /app/build   (distDir='build')

################# 2.  R U N N E R ###################
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# 3. Копируем только package-файлы
COPY package*.json ./

# 4. Ставим **только production**-зависимости
RUN npm ci --omit=dev --ignore-scripts

# 5. Переносим артефакты из builder
COPY --from=builder /app/build   ./build
COPY --from=builder /app/public  ./public

EXPOSE 3000
CMD ["npm", "start"]
