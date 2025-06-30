################ 1.  B U I L D E R ################
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --force          # dev+prod deps

COPY . .
RUN npm run build           # создаёт /app/.next

################ 2.  R U N N E R ##################
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# устанавливаем production-зависимости
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# копируем артефакты
COPY --from=builder /app/.next   ./.next
COPY --from=builder /app/public  ./public

EXPOSE 3000
CMD ["npm", "start"]
