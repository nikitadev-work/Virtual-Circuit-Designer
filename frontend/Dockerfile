############################################
# 1) Builder: собираем Next.js + LightningCSS
############################################
FROM node:20 AS builder

WORKDIR /app

# Устанавливаем сборочные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential python3 curl ca-certificates \
      pkg-config libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV CARGO_HOME=/root/.cargo
ENV PATH="${CARGO_HOME}/bin:${PATH}"
RUN rustc --version && cargo --version

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости с принудительной сборкой Lightning CSS
ENV LIGHTNINGCSS_BUILD_FROM_SOURCE=1
RUN npm install --force
RUN npm install lightningcss --build-from-source
RUN ls -la node_modules/lightningcss/ || echo "Lightning CSS directory not found"

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