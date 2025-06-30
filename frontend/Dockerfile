# 1. Используем официальный образ Node.js с поддержкой bun, npm и corepack
FROM node:20-alpine

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и lock-файл
COPY package*.json ./

RUN apt-get update && apt-get install -y curl build-essential
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustc --version

RUN npm install --force
RUN npm install lightningcss
RUN ls -la node_modules/lightningcss/

# 5. Копируем остальные файлы проекта
COPY . .

# 6. Собираем Next.js проект
RUN npm run build

# 7. Экспонируем порт, который использует next start (по умолчанию 3000)
EXPOSE 3000

# 8. Запускаем Next.js сервер
CMD ["npm", "start"]
