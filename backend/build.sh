#!/bin/bash

set -e  # Exit on any error

echo "Starting build process..."

# Upgrade pip to latest version
python -m pip install --upgrade pip

# Install wheel and setuptools first
pip install wheel setuptools

# Install dependencies with no cache and force reinstall for problematic packages
pip install --no-cache-dir -r requirements.txt

echo "Dependencies installed successfully!"

# Create necessary directories
mkdir -p /tmp/uploads

echo "Build completed successfully!"
