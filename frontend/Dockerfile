# 1. Используем официальный образ Node.js с поддержкой bun, npm и corepack
FROM node:20-alpine

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и lock-файл
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем остальные файлы проекта
COPY . .

# 6. Собираем Next.js проект
RUN npm run build

# 7. Экспонируем порт, который использует next start (по умолчанию 3000)
EXPOSE 3000

# 8. Запускаем Next.js сервер
CMD ["npm", "start"]
