# ---------- Stage 1: Build the React app ----------
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependency files first (for better layer caching)
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the React app (output will go to /app/dist)
RUN pnpm run build

# ---------- Stage 2: Serve using Nginx ----------
FROM nginx:1.27-alpine

# Copy the built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: use custom nginx.conf (see below)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
