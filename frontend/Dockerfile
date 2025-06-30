############################################
# 1) Builder: собираем Next.js + LightningCSS
############################################
FROM node:20-slim AS builder

WORKDIR /app

# Устанавливаем сборочные зависимости: gcc, python, rust
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential python3 curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Rust (для нативных плагинов, например LightningCSS)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV CARGO_HOME=/root/.cargo
ENV PATH="${CARGO_HOME}/bin:${PATH}"

# Говорим lightningcss собирать из исходников, и ставим Next.js deps
ENV LIGHTNINGCSS_BUILD_FROM_SOURCE=1
COPY package*.json ./
RUN npm ci

# Копируем код и билдим
COPY . .
RUN npm run build

############################################
# 2) Runner: запускаем Next.js
############################################
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Берём deps и билд из builder-а
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Открываем порт Next.js
EXPOSE 3000

# Стартуем сервер
CMD ["npm", "start"]
