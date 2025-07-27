#!/usr/bin/env bash
# build.sh

set -o errexit  # exit on error

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations (if using Alembic)
if [ -f "alembic.ini" ]; then
    echo "Running database migrations..."
    alembic upgrade head
fi

echo "Build completed successfully!"
