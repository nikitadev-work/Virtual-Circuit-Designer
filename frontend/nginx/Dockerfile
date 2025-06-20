FROM nginx:stable-alpine

# Удаляем все дефолтные конфиги
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

# Копируем наш полный конфиг как основной
COPY nginx.conf /etc/nginx/nginx.conf

# Проверяем конфиг
RUN nginx -t