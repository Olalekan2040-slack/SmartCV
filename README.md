<div align="center">

# 🎯 SmartCV
### AI-Powered Resume Builder with Dark Theme

*Create stunning professional resumes with the power of artificial intelligence*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br>

**🌟 [Live Demo](https://smartcv-demo.vercel.app) | 📚 [Documentation](./DEPLOYMENT.md) | 🐛 [Report Bug](https://github.com/Olalekan2040-slack/SmartCV/issues) | 💡 [Request Feature](https://github.com/Olalekan2040-slack/SmartCV/issues)**

</div>

---

SmartCV is a comprehensive resume builder application that helps users create professional CVs with AI assistance, real-time validation, PDF generation, and premium features.

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 **Core Features**
- 🤖 **AI-Powered Suggestions** - Intelligent content recommendations
- ⚡ **Real-time Validation** - Instant feedback on CV quality
- 🎨 **Multiple Templates** - Professional industry-specific designs
- 📄 **PDF Generation** - High-quality export with custom styling
- 📱 **Responsive Design** - Perfect on desktop and mobile
- 🌙 **Dark Theme** - Eye-friendly dark mode interface

</td>
<td width="50%">

### 💎 **Premium Features**
- ♾️ **Unlimited CVs** - Create as many resumes as needed
- 🏆 **Premium Templates** - Exclusive professional designs
- 🧠 **Advanced AI** - Enhanced content optimization
- 🆘 **Priority Support** - Get help when you need it
- 🎯 **Custom Templates** - Personalize to match your style
- 📊 **Analytics Dashboard** - Track CV performance

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

<div align="center">

### Backend
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

### Frontend
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query&logoColor=white)](https://react-query.tanstack.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)

### Additional
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Celery](https://img.shields.io/badge/Celery-37B24D?style=flat-square&logo=celery&logoColor=white)](https://docs.celeryproject.org/)

</div>

---

## � Quick Start

### 📋 Prerequisites

<details>
<summary>Click to expand system requirements</summary>

```bash
✅ Python 3.11 or higher
✅ Node.js 16+ and npm
✅ PostgreSQL 15+
✅ Redis 7+
✅ Git
```

</details>

### ⚡ One-Command Setup

```bash
# Clone and setup everything
git clone https://github.com/Olalekan2040-slack/SmartCV.git && cd SmartCV && chmod +x setup.sh && ./setup.sh
```

### 🔧 Manual Setup

<details>
<summary>Backend Setup</summary>

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 5. Setup database
createdb smartcv_db
alembic upgrade head

# 6. Start the server
uvicorn main:app --reload
```

</details>

<details>
<summary>Frontend Setup</summary>

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

</details>

---

## 📱 Screenshots

<div align="center">

### 🏠 Dark Theme Homepage
![Homepage](https://via.placeholder.com/800x400/1f2937/ffffff?text=SmartCV+Dark+Homepage)

### � CV Builder Interface
![CV Builder](https://via.placeholder.com/800x400/1f2937/ffffff?text=AI-Powered+CV+Builder)

### 💰 Pricing Page
![Pricing](https://via.placeholder.com/800x400/1f2937/ffffff?text=Flexible+Pricing+Plans)

</div>

---

## � Project Structure

```
SmartCV/
├── 🗂️ backend/                 # FastAPI backend
│   ├── 📁 app/
│   │   ├── 🛣️ api/            # API routes
│   │   ├── ⚙️ core/           # Core functionality
│   │   ├── 🗃️ models/         # Database models
│   │   ├── 📋 schemas/        # Pydantic schemas
│   │   ├── 🔧 services/       # Business logic
│   │   └── ⚡ tasks/          # Background tasks
│   ├── 🔄 alembic/            # Database migrations
│   ├── 📄 templates/          # PDF templates
│   └── 🐳 Dockerfile
├── 🗂️ frontend/               # React frontend
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 🧩 components/     # React components
│   │   ├── 🎨 pages/          # Page components
│   │   ├── 🔗 contexts/       # Context providers
│   │   └── 🛠️ services/       # API services
│   └── ⚙️ tailwind.config.js
├── 🔄 .github/                # GitHub workflows
├── 📖 README.md
└── 🚀 DEPLOYMENT.md
```

---

## 🌐 API Documentation

Once the backend is running, explore the interactive API docs:

<div align="center">

**📊 [Swagger UI](http://localhost:8000/docs) | 📚 [ReDoc](http://localhost:8000/redoc)**

</div>

### 🔑 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | 👤 User registration |
| `POST` | `/api/auth/login` | 🔐 User authentication |
| `GET` | `/api/cv/` | 📄 Get user's CVs |
| `POST` | `/api/cv/` | ➕ Create new CV |
| `PUT` | `/api/cv/{id}` | ✏️ Update CV |
| `POST` | `/api/cv/validate` | ✅ Validate CV data |
| `POST` | `/api/cv/{id}/generate-pdf` | 📄 Generate PDF |
| `POST` | `/api/payments/checkout` | 💳 Create Stripe checkout |

---

## 🚀 Deployment

### 🌐 Frontend Deployment

<table>
<tr>
<td align="center" width="33%">

**🔺 Vercel**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Olalekan2040-slack/SmartCV)

</td>
<td align="center" width="33%">

**🎯 Netlify**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Olalekan2040-slack/SmartCV)

</td>
<td align="center" width="33%">

**☁️ Railway**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/smartcv)

</td>
</tr>
</table>

### 🔧 Backend Deployment

| Platform | Status | Guide |
|----------|--------|-------|
| 🚄 Railway | ✅ Ready | [Deploy Backend](./DEPLOYMENT.md#railway) |
| 🎨 Render | ✅ Ready | [Deploy Backend](./DEPLOYMENT.md#render) |
| 🐳 Docker | ✅ Ready | [Docker Guide](./DEPLOYMENT.md#docker) |

---

## 🔧 Configuration

### � Environment Variables

<details>
<summary>Backend Configuration</summary>

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/smartcv_db

# JWT Authentication
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis & Celery
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# CORS
ALLOWED_HOSTS=["http://localhost:3000"]
```

</details>

<details>
<summary>Frontend Configuration</summary>

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

</details>

---

## 🧪 Testing

<div align="center">

### Run Tests

```bash
# Backend tests
cd backend && pytest --cov=app --cov-report=html

# Frontend tests  
cd frontend && npm test -- --coverage
```

</div>

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

<div align="center">

### 🚀 Quick Contribution Steps

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'feat: add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

</div>

### 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` ✨ New features
- `fix:` 🐛 Bug fixes
- `docs:` 📚 Documentation
- `style:` 💄 Code formatting
- `refactor:` ♻️ Code refactoring
- `test:` 🧪 Tests
- `chore:` 🔧 Maintenance

---

## 📊 Roadmap

<details>
<summary>🚀 Upcoming Features</summary>

- [ ] 🌍 **Multi-language Support** - International CV formats
- [ ] 🤖 **Advanced AI Integration** - GPT-powered content generation
- [ ] 📱 **Mobile App** - React Native mobile application
- [ ] 🔗 **LinkedIn Integration** - Import LinkedIn profile data
- [ ] 📈 **Analytics Dashboard** - CV performance tracking
- [ ] 📮 **Cover Letter Builder** - Matching cover letters
- [ ] 🎯 **ATS Optimization** - Applicant Tracking System compatibility
- [ ] 🎨 **Custom Theme Builder** - User-defined color schemes

</details>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🆘 Support

<div align="center">

### Get Help

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/smartcv)
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-black?style=for-the-badge&logo=github)](https://github.com/Olalekan2040-slack/SmartCV/issues)
[![Email](https://img.shields.io/badge/Email-Support-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@smartcv.com)

</div>

---

## � Show Your Support

<div align="center">

Give a ⭐️ if this project helped you!

[![GitHub stars](https://img.shields.io/github/stars/Olalekan2040-slack/SmartCV?style=social)](https://github.com/Olalekan2040-slack/SmartCV/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Olalekan2040-slack/SmartCV?style=social)](https://github.com/Olalekan2040-slack/SmartCV/network)

**Built with ❤️ by the SmartCV Team**

</div>

---

<div align="center">

### 🔗 Links

**[🌐 Website](https://smartcv.com) • [📚 Docs](./DEPLOYMENT.md) • [🐛 Issues](https://github.com/Olalekan2040-slack/SmartCV/issues) • [💬 Discussions](https://github.com/Olalekan2040-slack/SmartCV/discussions)**

</div>
