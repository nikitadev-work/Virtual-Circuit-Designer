FROM node:20 AS builder
WORKDIR /app

# Устанавливаем Rust toolchain для сборки нативного плагина
RUN apt-get update && apt-get install -y curl build-essential
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Говорим lightningcss собирать из исходников
ENV LIGHTNINGCSS_BUILD_FROM_SOURCE=1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
