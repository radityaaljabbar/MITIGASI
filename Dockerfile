# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Python dan dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    && ln -sf python3 /usr/bin/python

# Create virtual environment dan install ML libraries
RUN python3 -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --no-cache-dir \
        joblib \
        numpy \
        scikit-learn

# Set PATH untuk virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Copy package files first
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]