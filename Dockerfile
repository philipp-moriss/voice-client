# Use the Node alpine official image
# https://hub.docker.com/_/node
FROM node:lts-alpine AS build

# Set config
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

# Create and change to the app directory
WORKDIR /app

# Copy the files to the container image
COPY package*.json ./

# Install packages
RUN npm ci

# Copy local code to the container image
COPY . ./

# Build-time env for Vite (pass via --build-arg or Railway Variables)
ARG VITE_TELEGRAM_BOT_USERNAME
ARG VITE_API_URL
ENV VITE_TELEGRAM_BOT_USERNAME=$VITE_TELEGRAM_BOT_USERNAME
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# Use the Caddy image
FROM caddy

# Create and change to the app directory
WORKDIR /app

# Copy Caddyfile to the container image (do not run caddy fmt — it would expand $PORT at build time and break Railway)
COPY Caddyfile ./

# Copy built files to the container image
COPY --from=build /app/dist ./dist

# Use Caddy to run/serve the app
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
