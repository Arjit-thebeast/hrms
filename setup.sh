#!/bin/bash
# Setup script for HRMS development environment (Linux/Mac)

echo "======================================"
echo "HRMS Development Environment Setup"
echo "======================================"

# Backend Setup
echo ""
echo "[1/4] Setting up Django backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Creating .env file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env - please configure it before running"
fi

echo "Running migrations..."
python manage.py migrate

echo ""
echo "[2/4] Backend setup complete!"
echo "Start backend with: python manage.py runserver"

# Return to root
cd ..

# Frontend Setup
echo ""
echo "[3/4] Setting up React frontend..."
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

echo "Creating .env.local file..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "Created .env.local - update VITE_API_URL if needed"
fi

echo ""
echo "[4/4] Frontend setup complete!"
echo "Start frontend with: npm run dev"

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "Admin:    http://localhost:8000/admin"
echo ""
