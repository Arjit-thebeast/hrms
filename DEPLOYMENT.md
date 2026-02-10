# HRMS Deployment Checklist for Render

## Pre-Deployment

- [ ] Both frontend and backend fully tested locally
- [ ] All environment variables documented
- [ ] Database migrations created and tested
- [ ] Secret key generated for production
- [ ] Code committed and pushed to GitHub main branch

## Backend Deployment Steps

### 1. Prepare Backend
```bash
cd backend

# Generate SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Create .env for production reference
copy .env.example .env.production
# Edit .env.production with production values
```

### 2. Create Render Web Service
- [ ] Go to https://render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Configure:
  - [ ] **Name**: `hrms-backend`
  - [ ] **Environment**: Python 3
  - [ ] **Region**: Choose closest to users
  - [ ] **Branch**: main
  
### 3. Build & Start Commands
Set in Render dashboard:
- **Build Command**: 
  ```
  pip install -r requirements.txt && python manage.py migrate
  ```
- **Start Command**: 
  ```
  gunicorn hrms_backend.wsgi:application
  ```

### 4. Environment Variables (Add in Render Dashboard)
```
DEBUG=False
SECRET_KEY=<paste-generated-key>
ALLOWED_HOSTS=<your-service-name>.onrender.com
CORS_ALLOWED_ORIGINS=<your-frontend-domain>
DATABASE_URL=<leave-empty-for-sqlite-or-add-postgres>
```

### 5. Deploy
- [ ] Click "Create Web Service"
- [ ] Monitor deployment in "Logs" tab
- [ ] Test API: `https://<your-service>.onrender.com/api/employees/`

## Frontend Deployment Steps

### 1. Build Frontend
```bash
npm run build
```

### 2. Choose Deployment Option

#### Option A: Render Static Site
- [ ] Create new Static Site on Render
- [ ] Select GitHub repository
- [ ] **Build Command**: `npm run build`
- [ ] **Publish Directory**: `dist`
- [ ] **Environment Variable**: 
  - `VITE_API_URL=https://<your-backend>.onrender.com/api`
- [ ] Deploy

#### Option B: Vercel
```bash
npm install -g vercel
vercel
# Follow prompts
```

#### Option C: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Post-Deployment

### Testing
- [ ] Access frontend at deployed URL
- [ ] Load employees page (should be empty initially)
- [ ] Add a test employee via API
- [ ] Verify data persists after page reload
- [ ] Access Django admin: `https://<your-backend>.onrender.com/admin`
- [ ] Check logs for errors

### Database Management
- [ ] Create admin user: SSH into Render and run:
  ```bash
  python manage.py createsuperuser
  ```
- [ ] Or use Render's Shell feature in dashboard

### Monitoring
- [ ] Set up error notifications in Render
- [ ] Monitor build logs for failures
- [ ] Keep dependencies updated
- [ ] Regular backups if using PostgreSQL

## Domain Setup (Optional)

### Add Custom Domain to Render
1. In Render dashboard, go to Web Service
2. Click "Settings"
3. Add custom domain under "Custom Domain"
4. Add DNS records as shown (CNAME or A records)
5. Wait for DNS propagation (5-15 minutes)
6. Update CORS_ALLOWED_ORIGINS to include custom domain

## Rollback Procedure

If deployment has issues:
1. In Render dashboard, go to "Deployments"
2. Click dropdown on previous successful deployment
3. Select "Redeploy"
4. Or revert problematic code changes and push to GitHub

## Maintenance

- **Update dependencies**: 
  ```bash
  pip list --outdated
  npm outdated
  ```
- **Check Render logs** weekly for errors
- **Monitor free tier limits** if using free plan
- **Back up data** if using Render PostgreSQL

## Support

- Render Docs: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
- DRF: https://www.django-rest-framework.org/
