# SmartCV - AI-Powered Resume Builder

SmartCV is a comprehensive resume builder application that helps users create professional CVs with AI assistance, real-time validation, PDF generation, and premium features.

## 🚀 Features

### Core Features
- **AI-Powered Suggestions**: Get intelligent recommendations for improving CV content
- **Real-time Validation**: Instant feedback on required fields and content quality
- **Multiple Templates**: Professional templates for different industries
- **PDF Generation**: High-quality PDF export with custom styling
- **Responsive Design**: Works perfectly on desktop and mobile devices

### Premium Features
- **Unlimited CVs**: Create as many CVs as you need
- **Premium Templates**: Access to exclusive professional templates
- **Advanced AI Suggestions**: Enhanced content recommendations
- **Priority Support**: Get help when you need it
- **Template Customization**: Personalize templates to match your style

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **PDF Generation**: WeasyPrint
- **Background Tasks**: Celery + Redis
- **Payments**: Stripe
- **Deployment**: Docker

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 16+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SmartCV.git
   cd SmartCV/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb smartcv_db
   
   # Run migrations
   alembic upgrade head
   ```

6. **Start the application**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

### Docker Setup (Recommended)

1. **Start all services**
   ```bash
   cd backend
   docker-compose up -d
   ```

This will start:
- PostgreSQL database
- Redis server
- FastAPI backend
- Celery worker
- Celery beat scheduler

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://smartcv_user:smartcv_password@localhost/smartcv_db

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS
ALLOWED_HOSTS=["http://localhost:3000"]
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/cv/` - Get user's CVs
- `POST /api/cv/` - Create new CV
- `PUT /api/cv/{id}` - Update CV
- `POST /api/cv/validate` - Validate CV data
- `POST /api/cv/{id}/generate-pdf` - Generate PDF
- `POST /api/payments/create-checkout-session` - Create Stripe checkout

## 🏗 Project Structure

```
smartcv/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── core/          # Core functionality
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── tasks/         # Celery tasks
│   │   └── utils/         # Utilities
│   ├── alembic/           # Database migrations
│   ├── templates/         # PDF templates
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Deployment

### Backend Deployment

The application is containerized and can be deployed to:
- **Railway**: Easy deployment with database and Redis
- **Render**: Simple deployment with PostgreSQL add-on
- **AWS ECS**: For production scalability
- **DigitalOcean App Platform**: Quick deployment

### Frontend Deployment

- **Vercel**: Recommended for React applications
- **Netlify**: Easy static site deployment
- **AWS S3 + CloudFront**: For production

## 💳 Payment Integration

SmartCV uses Stripe for payment processing:

1. **Setup Stripe Account**
   - Create a Stripe account
   - Get your API keys
   - Set up webhook endpoints

2. **Configure Webhooks**
   - Endpoint: `https://your-api-domain.com/api/payments/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance & Scaling

- **Database**: PostgreSQL with proper indexing
- **Caching**: Redis for session storage and caching
- **Background Jobs**: Celery for PDF generation
- **File Storage**: Local storage (can be extended to S3)
- **CDN**: Recommended for static assets in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Email**: support@smartcv.com

## 🎯 Roadmap

- [ ] Advanced template editor
- [ ] LinkedIn integration
- [ ] Cover letter generator
- [ ] Job application tracking
- [ ] Resume analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] ATS optimization checker

---

Built with ❤️ by the SmartCV Team
