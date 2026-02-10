# HRMS (Human Resource Management System)

A full-stack HRMS application with a React/Vite frontend and Django REST backend.

## Project Structure

```
hrms/                          # Frontend (React + Vite)
├── src/
│   ├── components/           # React components
│   ├── services/             # API service (hrmsService.ts)
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── .env.example

backend/                       # Django REST Backend
├── hrms_backend/             # Django project settings
├── hrms_api/                 # Django app (models, views, serializers)
├── manage.py
├── requirements.txt
├── render.yaml               # Render deployment config
└── .env.example
```

## Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- pip and virtualenv

## Running Locally

### 1. Frontend Setup (React + Vite)

```bash
# Navigate to project root
cd hrms

# Install dependencies
npm install

# Create .env.local file
copy .env.example .env.local

# Run dev server (runs on http://localhost:5173)
npm run dev
```

### 2. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Run migrations
python manage.py migrate

# Create superuser (optional, for Django admin)
python manage.py createsuperuser

# Run development server (runs on http://localhost:8000)
python manage.py runserver
```

The frontend (http://localhost:5173) will automatically communicate with the backend (http://localhost:8000/api).

## API Endpoints

- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create new employee
- `DELETE /api/employees/{id}/` - Delete employee
- `GET /api/attendance/` - List attendance records
- `POST /api/attendance/` - Mark attendance
- `GET /api/dashboard/stats/` - Get dashboard statistics

## Building for Production

### Frontend
```bash
npm run build
```

This creates a `dist/` folder with optimized production build.

### Backend
```bash
# Install production dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run with gunicorn
gunicorn hrms_backend.wsgi:application
```

## Deploying to Render

### Backend Deployment

1. **Create a Render account** at https://render.com

2. **Push your code to GitHub** (required for Render integration)

3. **Create a new Web Service** on Render:
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt && python manage.py migrate`
   - Set start command: `gunicorn hrms_backend.wsgi:application`
   - Add environment variables:
     ```
     DEBUG=False
     ALLOWED_HOSTS=<your-service>.onrender.com
     SECRET_KEY=<generate-a-secure-key>
     CORS_ALLOWED_ORIGINS=<your-frontend-domain>
     ```

4. **Configure database** (optional):
   - For production, use Render's PostgreSQL addon instead of SQLite
   - Update `DATABASES` in `settings.py` with PostgreSQL credentials

5. **Deploy**: Render will automatically build and deploy on every push to main

### Frontend Deployment

1. **Build the app** locally:
   ```bash
   npm run build
   ```

2. **Deploy to a service** (Vercel, Netlify, or Render):

   **Option A: Render**
   - Create new Static Site on Render
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable: `VITE_API_URL=https://<your-backend>.onrender.com/api`

   **Option B: Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

## Environment Variables

### Frontend (.env.local / .env.production)
```
VITE_API_URL=http://localhost:8000/api  # Local
VITE_API_URL=https://your-backend.onrender.com/api  # Production
```

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True  # False in production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Development Tips

- **Restart Django server** after changing models: `python manage.py migrate`
- **Clear browser cache** if frontend doesn't update
- **Check API** directly at http://localhost:8000/api/employees/
- **Django Admin** available at http://localhost:8000/admin

## Troubleshooting

**CORS errors**: Make sure `CORS_ALLOWED_ORIGINS` includes your frontend URL

**API not responding**: Check that Django server is running on port 8000

**Database errors**: Run `python manage.py migrate` in backend

**Frontend not connecting**: Verify `VITE_API_URL` environment variable is set
