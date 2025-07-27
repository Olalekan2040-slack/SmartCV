#!/bin/bash

# SmartCV Complete Setup Script

echo "🎯 SmartCV - AI-Powered Resume Builder"
echo "======================================"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Docker
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker and Docker Compose found"
    USE_DOCKER=true
else
    echo "⚠️ Docker not found. Will use manual setup."
    USE_DOCKER=false
fi

if [ "$USE_DOCKER" = true ]; then
    echo ""
    echo "🐳 Docker Setup (Recommended)"
    echo "=============================="
    
    read -p "Use Docker setup? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting SmartCV with Docker..."
        cd backend
        
        # Copy environment file
        if [ ! -f .env ]; then
            cp .env.example .env
            echo "⚙️ Environment file created. Please edit backend/.env with your settings."
            echo "Press Enter to continue after editing..."
            read
        fi
        
        # Start services
        docker-compose up -d
        
        echo ""
        echo "✅ SmartCV is now running!"
        echo ""
        echo "📍 Services:"
        echo "   Backend API: http://localhost:8000"
        echo "   API Docs: http://localhost:8000/docs"
        echo "   Database: PostgreSQL on port 5432"
        echo "   Redis: Redis on port 6379"
        echo ""
        echo "🔧 To view logs:"
        echo "   docker-compose logs -f"
        echo ""
        echo "🛑 To stop services:"
        echo "   docker-compose down"
        echo ""
        echo "Now set up the frontend:"
        cd ../frontend
        ./setup.cmd  # For Windows
        # chmod +x setup.sh && ./setup.sh  # For Linux/Mac
        
        exit 0
    fi
fi

echo ""
echo "🔧 Manual Setup"
echo "==============="

# Backend setup
echo "1️⃣ Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚙️ Backend environment file created"
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.11+ and try again."
    exit 1
fi

# Setup backend
chmod +x setup.sh
./setup.sh

echo ""
echo "2️⃣ Setting up Frontend..."
cd ../frontend

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js 16+ and try again."
    exit 1
fi

# Setup frontend
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    ./setup.cmd
else
    chmod +x setup.sh
    ./setup.sh
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start Backend (in backend/ directory):"
echo "   uvicorn main:app --reload"
echo ""
echo "2. Start Frontend (in frontend/ directory):"
echo "   npm start"
echo ""
echo "3. Optional - Start Celery Worker (in backend/ directory):"
echo "   celery -A app.core.celery_config worker --loglevel=info"
echo ""
echo "📍 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "Happy coding! 🎉"
