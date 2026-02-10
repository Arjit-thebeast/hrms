@echo off
REM Setup script for HRMS development environment

echo ======================================
echo HRMS Development Environment Setup
echo ======================================

REM Backend Setup
echo.
echo [1/4] Setting up Django backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env - please configure it before running
)

echo Running migrations...
python manage.py migrate

echo.
echo [2/4] Backend setup complete!
echo Start backend with: python manage.py runserver

REM Return to root
cd ..

REM Frontend Setup
echo.
echo [3/4] Setting up React frontend...
if not exist node_modules (
    echo Installing Node dependencies...
    npm install
)

echo Creating .env.local file...
if not exist .env.local (
    copy .env.example .env.local
    echo Created .env.local - update VITE_API_URL if needed
)

echo.
echo [4/4] Frontend setup complete!
echo Start frontend with: npm run dev

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To run the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Terminal 2 (Frontend):
echo   npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo.
pause
