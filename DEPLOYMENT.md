# SmartCV Deployment Guide

This guide covers various deployment options for SmartCV.

## Quick Deploy Options

### Frontend Deployment

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variables:
   - `REACT_APP_API_URL`: Your backend API URL

#### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Add environment variables as needed

### Backend Deployment

#### Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Select the `backend` folder as root
3. Railway will auto-detect the Python app
4. Add environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_URL`: Redis connection string
   - `SECRET_KEY`: JWT secret key
   - `STRIPE_SECRET_KEY`: Stripe secret key

#### Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Docker Deployment

### Using Docker Compose (Development)
```bash
cd backend
docker-compose up -d
```

### Production Docker Setup
```bash
# Build and run backend
cd backend
docker build -t smartcv-backend .
docker run -p 8000:8000 smartcv-backend

# Build and run frontend
cd frontend
docker build -t smartcv-frontend .
docker run -p 3000:3000 smartcv-frontend
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
REDIS_URL=redis://host:port
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
ALLOWED_HOSTS=["https://yourdomain.com"]
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## Database Setup

### PostgreSQL (Production)
1. Create a PostgreSQL database
2. Run migrations:
   ```bash
   cd backend
   alembic upgrade head
   ```

### Redis (Production)
1. Set up Redis instance
2. Configure Redis URL in environment variables

## SSL/HTTPS

For production deployments, ensure:
1. SSL certificates are configured
2. HTTPS is enforced
3. CORS settings are properly configured
4. Environment variables are secure

## Monitoring

Consider setting up:
- Application monitoring (e.g., Sentry)
- Database monitoring
- Performance monitoring
- Log aggregation

## Scaling

For high-traffic applications:
1. Use a load balancer
2. Set up multiple backend instances
3. Use a CDN for static assets
4. Implement database connection pooling
5. Use Redis for caching

## Backup Strategy

1. Regular database backups
2. Environment variable backups
3. Code repository backups
4. File storage backups (if applicable)
