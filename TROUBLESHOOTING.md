# Troubleshooting Guide

## Common Issues and Solutions

### 1. Pydantic Import Errors

**Error**: `BaseSettings has been moved to the pydantic-settings package`

**Solution**: This has been fixed in the latest code. The project now uses:
- `pydantic-settings` for configuration management
- `pydantic` for data validation

### 2. Database Connection Issues

**Error**: `psycopg2.OperationalError: could not connect to server`

**Solutions**:
1. Ensure PostgreSQL is running:
   ```bash
   # Ubuntu/Debian
   sudo systemctl status postgresql
   
   # macOS
   brew services list | grep postgresql
   ```

2. Check your `.env` file configuration:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/jiuwen_db
   ```

3. Create the database if it doesn't exist:
   ```bash
   createdb jiuwen_db
   ```

### 3. Python Version Issues

**Error**: `Python version not compatible`

**Solution**: Ensure you have Python 3.11+ installed:
```bash
python3 --version
# Should show Python 3.11.x or higher
```

### 4. Virtual Environment Issues

**Error**: `venv/bin/activate: No such file or directory`

**Solution**: Run the setup script:
```bash
cd backend
python3 setup.py
```

### 5. Port Already in Use

**Error**: `Address already in use`

**Solution**: Check what's using the ports:
```bash
# Check port 8000 (backend)
lsof -i :8000

# Check port 3000 (frontend)
lsof -i :3000

# Kill processes if needed
kill -9 <PID>
```

## Manual Setup Steps

If the automated scripts fail, you can set up manually:

### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database
python3 init_db.py

# Start the server
python3 main.py
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Make sure your `.env` file contains:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jiuwen_db

# Security
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

## Getting Help

If you're still experiencing issues:

1. Check the logs for specific error messages
2. Ensure all dependencies are properly installed
3. Verify your system meets the requirements
4. Check that ports 8000 and 3000 are available