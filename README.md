# Jiuwen Agent Studio

专业的LLM智能体开发和管理平台

## 🏗️ **项目结构**

```
jiuwen-agent-studio/
├── frontend/                 # React + TypeScript 前端应用
│   ├── src/                 # 源代码
│   ├── packages/            # 工作流画布包
│   ├── package.json         # 前端依赖
│   └── Dockerfile           # 前端 Docker 配置
├── backend/                  # FastAPI 后端服务
│   ├── app/                 # 应用代码
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 数据模型
│   │   ├── routers/        # API 路由
│   │   └── schemas/        # 数据验证
│   ├── requirements.txt     # Python 依赖
│   └── Dockerfile           # 后端 Docker 配置
├── docker/                   # Docker 配置文件
│   ├── docker-compose.yml   # 生产环境配置
│   └── docker-compose.dev.yml # 开发环境配置
├── setup_dev.sh             # 开发环境设置脚本
├── start_dev.sh             # 启动开发环境
├── stop_dev.sh              # 停止开发环境
└── README.md                # 项目文档
```

## 🚀 **快速开始**

### **前置要求**

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+

### **一键设置开发环境**

```bash
# 克隆项目
git clone <repository-url>
cd jiuwen-agent-studio

# 设置开发环境
chmod +x setup_dev.sh
./setup_dev.sh

# 启动开发环境
chmod +x start_dev.sh
./start_dev.sh
```

### **手动设置**

#### **后端设置**

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 创建环境变量文件
cp .env.example .env

# 启动开发服务器
python run_dev.py
```

#### **前端设置**

```bash
cd frontend

# 安装依赖
npm install

# 创建环境变量文件
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# 启动开发服务器
npm run dev
```

## 🐳 **Docker 部署**

### **开发环境**

```bash
cd docker
docker-compose -f docker-compose.dev.yml up -d
```

### **生产环境**

```bash
cd docker
docker-compose up -d
```

## 📚 **API 文档**

启动后端服务后，访问以下地址查看 API 文档：

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## 🔧 **主要功能**

### **工作流管理**
- ✅ 创建工作流
- ✅ 编辑工作流
- ✅ 运行工作流
- ✅ 删除工作流
- ✅ 工作流状态监控

### **用户管理**
- ✅ 用户注册/登录
- ✅ JWT 认证
- ✅ 用户权限管理
- ✅ 用户信息更新

### **AI 模型配置**
- ✅ 支持多种 AI 提供商
- ✅ 模型参数配置
- ✅ API 密钥管理
- ✅ 模型连接测试

### **工作流画布**
- ✅ 可视化工作流设计
- ✅ 节点拖拽和连接
- ✅ 实时预览
- ✅ 导入/导出功能

## 🌐 **访问地址**

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **健康检查**: http://localhost:8000/api/health

## 🛠️ **技术栈**

### **前端**
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式
- FlowGram.AI 工作流画布

### **后端**
- FastAPI (Python)
- SQLAlchemy ORM
- Pydantic 数据验证
- JWT 认证
- PostgreSQL/Redis

### **部署**
- Docker & Docker Compose
- Nginx 反向代理
- 多环境配置

## 📝 **开发指南**

### **添加新的 API 端点**

1. 在 `backend/app/routers/` 中创建新的路由文件
2. 在 `backend/app/schemas/` 中定义数据模型
3. 在 `backend/app/models/` 中定义数据库模型
4. 在 `main.py` 中注册路由

### **前端组件开发**

1. 在 `frontend/src/components/` 中创建组件
2. 使用 TypeScript 定义类型
3. 遵循项目代码规范

## 🐛 **故障排除**

### **常见问题**

1. **端口冲突**: 检查 3000 和 8000 端口是否被占用
2. **数据库连接**: 确保 PostgreSQL 服务正在运行
3. **依赖安装**: 删除 `node_modules` 和 `venv` 重新安装

### **日志查看**

```bash
# 查看 Docker 日志
docker-compose -f docker/docker-compose.dev.yml logs -f

# 查看特定服务日志
docker-compose -f docker/docker-compose.dev.yml logs -f backend-dev
```

## 📄 **许可证**

MIT License

## 🤝 **贡献指南**

欢迎提交 Issue 和 Pull Request！

---

**Jiuwen Agent Studio** - 让 AI 智能体开发更简单 🚀