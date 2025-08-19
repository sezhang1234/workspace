# Jiuwen Agent Studio

A modern, open-source Agent Studio platform for developing, debugging, and orchestrating AI agents with visual workflow design.

## Features

- 🤖 **Agent Development & Debugging**: Create and test AI agents with real-time debugging
- 🎨 **Canvas-based Workflow Orchestration**: Visual workflow design with rich node library
- 📝 **Prompt Management**: Develop, optimize, and manage prompts with version control
- 🧠 **AI Model Management**: Configure and manage multiple AI models from various providers
- ⚙️ **Settings & Configuration**: Comprehensive user preferences and account management
- 🔐 **Account Management**: Secure authentication with welcome, login, and logout pages
- 🚀 **Modern Tech Stack**: React, Zustand, MUI, TailwindCSS frontend with FastAPI backend

## Tech Stack

### Frontend
- React 18 with TypeScript
- Zustand for state management
- Material-UI (MUI) components
- TailwindCSS for styling
- React Flow for canvas-based workflows

### Backend
- FastAPI with Python 3.11+
- SQLAlchemy ORM
- PostgreSQL database
- JWT authentication
- WebSocket support for real-time features

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 13+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd jiuwen-agent-studio
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the development servers

**Option 1: Use the startup script (recommended)**
```bash
./start.sh
```

**Option 2: Manual startup**
```bash
# Frontend (in frontend directory)
npm run dev

# Backend (in backend directory)
uvicorn main:app --reload
```

## Project Structure

```
jiuwen-agent-studio/
├── frontend/                 # React frontend application
├── backend/                  # FastAPI backend application
├── docs/                     # Documentation
└── README.md                 # This file
```

## Contributing

We welcome contributions! Please read our contributing guidelines and code of conduct.

## License

MIT License - see LICENSE file for details.