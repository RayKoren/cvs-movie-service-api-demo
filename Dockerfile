# syntax=docker/dockerfile:1

# -------- Dependencies stage --------
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && cp -R node_modules /prod_node_modules
RUN npm ci

# -------- Build stage --------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY db ./db
RUN npm run build

# -------- Test stage --------
FROM node:20-alpine AS test
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./
COPY src ./src
# Copy production databases as reference (tests will create their own)
COPY db ./db
# Copy test databases for CI
COPY --from=build /app/dist ./dist
# Set environment for tests
ENV NODE_ENV=test
# Create test database directory and run unit tests only
RUN mkdir -p test-db && chmod 755 test-db && npm run test:unit

# -------- Runtime image --------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=dependencies /prod_node_modules ./node_modules
COPY package*.json ./
COPY db ./db
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]

