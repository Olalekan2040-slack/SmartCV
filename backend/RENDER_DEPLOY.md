# Render Deployment Guide for SmartCV Backend

## Quick Setup

### 1. Create Render Web Service
- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository: `https://github.com/Olalekan2040-slack/SmartCV`

### 2. Configure Service Settings
```
Name: smartcv-backend
Root Directory: backend
Runtime: Python 3.11.6
Build Command: ./build.sh
Start Command: ./start.sh
```

### 3. Environment Variables
Add these in Render dashboard under "Environment":

**Required:**
```
DATABASE_URL = your_aiven_postgresql_connection_string_here
SECRET_KEY = your-super-secret-jwt-key-here
ENVIRONMENT = production
DEBUG = false
UPLOAD_DIR = /tmp/uploads/
```

**Optional (can be left empty):**
```
ALLOWED_HOSTS = ["https://your-frontend-url.vercel.app"]
REDIS_URL = 
CELERY_BROKER_URL = 
CELERY_RESULT_BACKEND = 
STRIPE_SECRET_KEY = 
STRIPE_PUBLISHABLE_KEY = 
STRIPE_WEBHOOK_SECRET = 
SMTP_USER = 
SMTP_PASSWORD = 
GEMINI_API_KEY = 
```

## Troubleshooting Build Issues

### If you get Rust/Cargo compilation errors:
1. Use `requirements-minimal.txt` instead of `requirements.txt`
2. Update build.sh to use: `pip install -r requirements-minimal.txt`

### If you get wheel building errors:
1. The current setup removes all problematic dependencies
2. Uses PyJWT instead of python-jose
3. Uses built-in password hashing instead of passlib/bcrypt
4. Avoids any packages that require Rust compilation

### If build still fails:
Try this ultra-minimal approach:
1. Use only: fastapi, uvicorn, gunicorn, sqlalchemy, psycopg2-binary
2. Remove PDF generation temporarily
3. Add features back one by one

## Files Created for Deployment:
- `build.sh` - Build script for Render
- `start.sh` - Start script with Gunicorn
- `runtime.txt` - Python version specification
- `render.yaml` - Service configuration
- `requirements.txt` - Minimal dependencies
- `requirements-minimal.txt` - Ultra-minimal backup

## Database Setup:
- Using Aiven PostgreSQL (already configured)
- Database URL is in environment variables
- Tables will be created automatically on first run
