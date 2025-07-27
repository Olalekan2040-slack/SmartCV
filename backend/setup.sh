#!/bin/bash

# SmartCV Backend Setup Script

echo "🚀 Setting up SmartCV Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "✏️ Please edit .env file with your configuration"
fi

# Check if PostgreSQL is running
echo "🗄️ Checking database connection..."
python -c "
import psycopg2
from app.core.config import settings
try:
    conn = psycopg2.connect(settings.DATABASE_URL)
    conn.close()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    print('Please ensure PostgreSQL is running and configured correctly')
"

# Run database migrations
echo "🔄 Running database migrations..."
alembic upgrade head

echo "✅ Backend setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   uvicorn main:app --reload"
echo ""
echo "🔧 To start Celery worker:"
echo "   celery -A app.core.celery_config worker --loglevel=info"
echo ""
echo "⏰ To start Celery beat:"
echo "   celery -A app.core.celery_config beat --loglevel=info"
