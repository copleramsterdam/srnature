# Use official Node.js LTS alpine image
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies for compilation
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build Vite frontend and bundled server.ts to dist/server.cjs
RUN npm run build

# Prune devDependencies to keep production image footprint minimal
RUN npm prune --production

# Expose port 3000
EXPOSE 3000

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3000

# Start production server
CMD ["npm", "run", "start"]
