# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Set NODE_ENV untuk production build
ENV NODE_ENV=production
ENV VITE_MODE=production

RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:stable-alpine

# Instal 'envsubst' yang merupakan bagian dari 'gettext'
RUN apk add --no-cache gettext

# Salin file konfigurasi Nginx yang sudah menjadi template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Salin script startup
COPY start.sh /start.sh

# Jadikan script startup bisa dieksekusi
RUN chmod +x /start.sh

# Salin hasil build dari stage pertama ke direktori web root Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080 sebagai petunjuk (opsional tapi praktik yang baik)
EXPOSE 8080

# Jalankan startup script saat container dimulai
CMD ["/start.sh"]