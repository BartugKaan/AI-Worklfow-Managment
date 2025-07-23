# AI Agent App with GPT-4.1-mini Integration

A modern AI agent creation and management application with integrated GPT-4.1-mini agent generation capabilities.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19 and Tailwind CSS
- **Backend**: Python FastAPI with uvicorn server
- **Database**: SQLite with Prisma ORM
- **AI Integration**: GPT-4.1-mini (gpt-4o-mini) for intelligent agent generation

## ✨ Features

- 🤖 **AI-Powered Agent Creation**: Generate comprehensive agent configurations using GPT-4.1-mini
- 💬 **Real-time Conversations**: Chat with your agents using their system and query prompts
- 🎯 **Smart Tool Selection**: Automatically selects appropriate tools based on agent requirements
- 📝 **Rich Configuration**: Generate detailed system prompts, query prompts, and descriptions
- 🔧 **Tool Integration**: Support for Web Search, Code Execution, File Analysis, and general tools
- 💾 **Database Management**: Full CRUD operations for agent management
- 🎨 **Modern UI**: Clean, responsive interface with Radix UI components
- 🔄 **Agent Switching**: Seamlessly switch between different agents in conversations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key

### 1. Clone and Setup
```bash
git clone <your-repo>
cd ai-agent-app-main
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your-api-key-here
```

### 3. Automatic Setup (Recommended)
```bash
python setup_and_run.py
```

### 4. Manual Setup (Alternative)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Setup database
npm run db:push

# Start backend (Terminal 1)
python start_backend.py

# Start frontend (Terminal 2)
npm run dev
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database Studio**: `npm run db:studio`

## 📖 How to Use

### Creating an AI Agent

1. **Navigate to Agent Creation**
   - Open http://localhost:3000
   - Click "Agent Creation Section" or go to `/add-agent`

2. **Describe Your Agent**
   - Enter a detailed description in the "Agent Creation Prompt" area
   - Be specific about the agent's role, capabilities, and behavior

3. **Generate with AI**
   - Click "Generate Agent with AI" button
   - Wait for GPT-4.1-mini to create the configuration

4. **Review and Customize**
   - Review the generated agent name, description, and prompts
   - Modify any fields as needed
   - Adjust tool selections

5. **Create Agent**
   - Click "Create Agent" to save to database
   - Your agent is now ready to use

### Chatting with Agents

1. **Select an Agent**
   - Choose any agent from the "Agents" sidebar
   - The selected agent will be highlighted in black

2. **Start Conversation**
   - Type your message in the "Message Input" area
   - Press Enter or click "Send Message"

3. **Continue Chatting**
   - View the conversation history in the main area
   - Agent responses use the system and query prompts you configured
   - Switch agents anytime to start a new conversation

### Example Agent Descriptions

**Python Code Assistant:**
```
Create a Python coding assistant that helps with code review, debugging, testing, and can execute code to validate solutions. It should analyze code files and provide improvement suggestions.
```

**Research Assistant:**
```
Create a research assistant that can search the web for information, analyze documents, and provide comprehensive research summaries on various topics.
```

## 🛠️ Development

### Available Scripts

```bash
# Frontend development
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server

# Backend development
npm run backend      # Start Python backend
python start_backend.py  # Alternative backend start

# Database management
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio

# Complete setup
npm run setup        # Setup and run everything
python setup_and_run.py  # Alternative complete setup
```

### Project Structure

```
ai-agent-app-main/
├── backend/
│   └── main.py              # FastAPI backend
├── src/
│   ├── app/
│   │   ├── add-agent/       # Agent creation page
│   │   └── api/             # Next.js API routes
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities and Prisma client
├── prisma/
│   └── schema.prisma        # Database schema
├── start_backend.py         # Backend startup script
├── setup_and_run.py         # Complete setup script
└── requirements.txt         # Python dependencies
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your-openai-api-key

# Optional
DATABASE_URL=file:./dev.db
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Available Tools

The system can automatically select from these tools:

- **Tool**: General purpose operations
- **Web Search**: Online information gathering
- **Code Execution**: Running and testing code
- **File Analysis**: Processing and analyzing files

## 🚀 Deployment

### Backend Deployment
```bash
# Production backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment
```bash
# Build and start
npm run build
npm run start
```

## 🧪 Testing

```bash
# Test backend functionality
curl http://localhost:8000/health

# Test agent generation
curl -X POST http://localhost:8000/api/generate-agent \
  -H "Content-Type: application/json" \
  -d '{"description": "Create a test agent"}'
```

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
