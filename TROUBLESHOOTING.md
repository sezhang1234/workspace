# 🔧 Troubleshooting Guide

## 🐳 Docker Issues

### **Error: "workspace:*" protocol not supported**

**Problem**: npm install fails with `Unsupported URL Type "workspace:"`

**Solution**: Use the simplified development approach:

```bash
# Instead of the full Docker setup, use backend-only Docker
./start_dev_simple.sh

# Then run frontend locally
cd frontend
npm install
npm run dev
```

### **Error: Port already in use**

**Problem**: Ports 3000, 8000, 5433, or 6380 are already occupied

**Solution**: 
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8000
lsof -i :5433
lsof -i :6380

# Kill the processes or change ports in docker-compose files
```

### **Error: Docker build fails**

**Problem**: Frontend Docker build fails due to workspace dependencies

**Solution**: Use the simplified approach:
1. Run backend in Docker: `./start_dev_simple.sh`
2. Run frontend locally: `cd frontend && npm run dev`

## 🐍 Python Issues

### **Error: Module not found**

**Problem**: Import errors in backend

**Solution**:
```bash
cd backend
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### **Error: Port already in use (Backend)**

**Problem**: Backend can't start on port 8000

**Solution**:
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Or change port in backend/.env
PORT=8001
```

## ⚛️ Frontend Issues

### **Error: npm install fails**

**Problem**: Dependencies can't be installed

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

### **Error: Vite build fails**

**Problem**: Build errors in frontend

**Solution**:
```bash
cd frontend
npm run build

# Check for specific error messages
# Common issues: TypeScript errors, missing dependencies
```

## 🗄️ Database Issues

### **Error: Database connection failed**

**Problem**: Backend can't connect to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Check logs
docker-compose -f docker/docker-compose.backend.yml logs postgres-dev

# Restart services
./stop_dev_simple.sh
./start_dev_simple.sh
```

### **Error: Redis connection failed**

**Problem**: Backend can't connect to Redis

**Solution**:
```bash
# Check if Redis container is running
docker ps | grep redis

# Check logs
docker-compose -f docker/docker-compose.backend.yml logs redis-dev
```

## 🔐 Authentication Issues

### **Error: JWT token invalid**

**Problem**: Authentication fails

**Solution**:
1. Check if backend is running: `curl http://localhost:8000/api/health`
2. Verify JWT secret in backend/.env
3. Check token expiration time

### **Error: CORS issues**

**Problem**: Frontend can't call backend API

**Solution**:
1. Verify CORS settings in backend/main.py
2. Check if frontend URL is in allowed origins
3. Ensure backend is running on correct port

## 🚀 Development Workflow

### **Recommended Development Setup**

1. **Start backend services only**:
   ```bash
   ./start_dev_simple.sh
   ```

2. **Run frontend locally**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access your application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

### **Why This Approach?**

- **Faster development**: No Docker build delays for frontend
- **Better debugging**: Direct access to frontend logs and hot reload
- **Easier dependency management**: npm works directly with local packages
- **Consistent backend**: Docker ensures consistent database and services

## 📋 Common Commands

### **Backend Management**
```bash
# Start backend services
./start_dev_simple.sh

# Stop backend services
./stop_dev_simple.sh

# View backend logs
docker-compose -f docker/docker-compose.backend.yml logs -f backend-dev

# Restart backend
docker-compose -f docker/docker-compose.backend.yml restart backend-dev
```

### **Frontend Management**
```bash
# Install dependencies
cd frontend && npm install

# Start development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build
```

### **Database Management**
```bash
# Access PostgreSQL
docker exec -it $(docker ps -q -f name=postgres-dev) psql -U jiuwen_dev_user -d jiuwen_studio_dev

# Access Redis
docker exec -it $(docker ps -q -f name=redis-dev) redis-cli
```

## 🆘 Still Having Issues?

1. **Check logs**: All services provide detailed logging
2. **Verify versions**: Ensure you have the required versions of Docker, Node.js, and Python
3. **Clean environment**: Remove all containers and volumes, then restart
4. **Check file permissions**: Ensure scripts are executable (`chmod +x *.sh`)

---

**Need more help?** Check the main README.md or create an issue in the repository.