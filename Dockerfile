# Use Ubuntu 22.04 (has glibc 2.35+)
FROM ubuntu:22.04

# Install Node.js (LTS), npm, curl, git, and other dependencies
RUN apt-get update && \
    apt-get install -y curl git build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm && \
    npm install -g wrangler@4.38.0 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /workspace

# Copy project files
COPY . /workspace

# Install project dependencies
RUN npm install

# Default command: bash shell
CMD ["bash"]
