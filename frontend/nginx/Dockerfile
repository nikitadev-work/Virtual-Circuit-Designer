# nginx/Dockerfile

# Use the official Nginx image from Docker Hub
FROM nginx:stable-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom configuration file to the Nginx conf.d directory
# We'll name it default.conf, but any name ending in .conf works.
COPY nginx.conf /etc/nginx/conf.d/default.conf

