# Dockerfile for Next.js

# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/data ./data
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Pass the NEXTAUTH_SECRET environment variable
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Set the command to start the app
CMD ["npm", "start"]
