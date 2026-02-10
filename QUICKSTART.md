# HRMS - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```
Backend will run at: **http://localhost:8000**

### Step 2: Frontend Setup (New Terminal)
```bash
npm install
npm run dev
```
Frontend will run at: **http://localhost:5173**

## 📝 Data Storage

Previously used localStorage (browser storage). Now uses:
- **Local Development**: SQLite database (`backend/db.sqlite3`)
- **Production (Render)**: PostgreSQL (Render addon)

## 🌐 Deploying to Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit with Django backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git push -u origin main
```

### Step 2: Create Backend on Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hrms-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn hrms_backend.wsgi:application`
5. Add Environment Variables:
   - `DEBUG=False`
   - `SECRET_KEY=generate-a-random-string-here`
   - `ALLOWED_HOSTS=your-service-name.onrender.com`
   - `CORS_ALLOWED_ORIGINS=your-frontend-domain.com`
6. Click "Create Web Service"

### Step 3: Deploy Frontend
1. Build: `npm run build`
2. Deploy to Render, Vercel, or Netlify
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

## 📊 API Endpoints

```
GET    /api/employees/              - List all
POST   /api/employees/              - Create
DELETE /api/employees/{id}/         - Delete

GET    /api/attendance/             - List records
POST   /api/attendance/             - Mark attendance

GET    /api/dashboard/stats/        - Get statistics
```

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Update `CORS_ALLOWED_ORIGINS` in backend `.env` |
| API 404 | Make sure Django is running on port 8000 |
| Database Error | Run `python manage.py migrate` |
| Port Already in Use | Kill process on port 8000: `netstat -ano \| findstr :8000` |

## 📚 Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Django 5.0 + Django REST Framework
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Hosting**: Render

## 🎯 Next Steps

1. ✅ Install and run locally
2. ✅ Test API endpoints
3. ✅ Add some employee data in Django admin
4. ✅ Push to GitHub
5. ✅ Deploy to Render
