#!/usr/bin/env bash
# build.sh

set -o errexit  # exit on error

echo "Starting build process..."

# Update pip and setuptools
pip install --upgrade pip setuptools wheel

# Install system dependencies that might be needed
echo "Installing system packages..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory
mkdir -p /tmp/uploads

# Run database migrations (if using Alembic)
if [ -f "alembic.ini" ]; then
    echo "Running database migrations..."
    alembic upgrade head
fi

echo "Build completed successfully!"
