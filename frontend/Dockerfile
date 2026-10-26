# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage (Nginx Alpine)
FROM nginx:alpine

# Default backend host (fallback)
ENV BACKEND_HOST=backend:5020

# Remove default nginx configs
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/templates/*

# Copy built static files to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx template and entrypoint script
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
