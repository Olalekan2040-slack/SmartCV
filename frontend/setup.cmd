@echo off

echo 🚀 Setting up SmartCV Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    exit /b 1
)

REM Install dependencies
echo 📥 Installing Node.js dependencies...
npm install

REM Create environment file if it doesn't exist
if not exist .env (
    echo ⚙️ Creating environment file...
    echo REACT_APP_API_URL=http://localhost:8000/api > .env
    echo ✏️ Environment file created with default settings
)

echo ✅ Frontend setup complete!
echo.
echo 🚀 To start the development server:
echo    npm start
echo.
echo 🏗️ To build for production:
echo    npm run build
