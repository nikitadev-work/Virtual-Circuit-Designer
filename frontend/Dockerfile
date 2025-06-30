FROM node:20 AS builder
WORKDIR /app

# 1) Устанавливаем инструменты для сборки C/C++ и Python (нужно для node-gyp)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      python3 \
      curl \
    && rm -rf /var/lib/apt/lists/*

# 2) Ставим Rust toolchain и настраиваем CARGO_HOME/PATH
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV CARGO_HOME=/root/.cargo
ENV PATH="${CARGO_HOME}/bin:${PATH}"

# 3) Заставляем lightningcss собираться из исходников при npm ci
ENV LIGHTNINGCSS_BUILD_FROM_SOURCE=1

# 4) Устанавливаем зависимости (включая LightningCSS)
COPY package*.json ./
RUN npm ci

# 5) Копируем весь код и запускаем сборку Next.js
COPY . .
RUN npm run build

# ---
# Тут ваш production‑стадия: копируем статику или настраиваем сервер, как нужно
