# Multi-stage Dockerfile for Enkephalos Frontend

# Stage 1: Build React/Vite App
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Handle broken local symlinks in public (e.g. local obsidian media path)
RUN if [ -L public/media ] && [ ! -e public/media ]; then rm public/media && mkdir -p public/media; fi

# Build production bundle
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
