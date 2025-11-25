# Stage 1: Build Stage (Development and Compilation)
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies like nodemon)
RUN npm install

# Copy the source code into the container
COPY . .

# Compile the TypeScript code (for production)
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json /app/
COPY --from=build /app/tsconfig.json /app/

# Install only production dependencies
RUN npm install --omit=dev

# Clean up the npm cache to reduce image size
RUN npm cache clean --force

# Expose the application port
EXPOSE 9900

# Set default command for production
CMD ["npm", "start"]

# Stage 3: Development Stage
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files for development dependencies
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies like nodemon)
RUN npm install

# Copy the source code into the container
COPY . .

# Install nodemon globally for watching file changes
RUN npm install -g nodemon

# Expose the application port
EXPOSE 9900

# Set the command to run in development (with nodemon)
CMD ["npm", "run", "dev"]
