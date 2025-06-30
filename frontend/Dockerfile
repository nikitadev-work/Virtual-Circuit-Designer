# ---- builder ----
FROM node:20 AS builder
WORKDIR /app
# … npm install, npm run build …

# ---- runner ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
#   ⬇⬇ изменили каталог dist ⬇⬇
COPY --from=builder /app/build ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
