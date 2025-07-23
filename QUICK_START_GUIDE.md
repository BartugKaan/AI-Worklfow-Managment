# Quick Start Guide: AI Agent Creation with GPT-4.1-mini

This guide will help you quickly set up and use the AI Agent App with integrated GPT-4.1-mini agent creation.

## 🏗️ Architecture

- **Frontend**: Next.js (React) - Port 3000
- **Backend**: Python FastAPI with uvicorn - Port 8000
- **Database**: SQLite with Prisma ORM
- **AI**: GPT-4.1-mini (gpt-4o-mini) for agent generation

## 🚀 Quick Setup (5 minutes)

### 1. Set Your OpenAI API Key

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your-api-key-here
```

### 2. Install Dependencies and Start Everything

```bash
# Option 1: Automatic setup (recommended)
python setup_and_run.py

# Option 2: Manual setup
pip install -r requirements.txt
npm install
```

### 3. Start Services Separately (if needed)

```bash
# Terminal 1: Start Python backend
python start_backend.py
# or
npm run backend

# Terminal 2: Start Next.js frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 How to Use Agent Creation

1. **Open the AI Agent App** at http://localhost:3001
2. **Click "Agent Creation Section"** or navigate to `/add-agent`
3. **Enter your agent description** in the "Agent Creation Prompt" text area
4. **Click "Generate Agent with AI"** button
5. **Wait for GPT-4.1-mini** to generate the configuration
6. **Review and modify** the generated fields if needed
7. **Select/deselect tools** as appropriate
8. **Click "Create Agent"** to save

## 📁 Files Overview

| File                | Purpose                               |
| ------------------- | ------------------------------------- |
| `backend/main.py`   | FastAPI backend with agent generation |
| `start_backend.py`  | Backend startup script                |
| `setup_and_run.py`  | Complete setup and run script         |
| `start_backend.sh`  | Unix/Linux/Mac backend starter        |
| `start_backend.ps1` | Windows PowerShell backend starter    |
| `requirements.txt`  | Python dependencies                   |
| `.env.example`      | Environment variables template        |

## 🎯 Usage Examples

### Example Agent Descriptions

**Python Code Assistant:**

```
Create a Python coding assistant that helps with code review, debugging, testing, and can execute code to validate solutions. It should analyze code files and provide improvement suggestions.
```

**Research Assistant:**

```
Create a research assistant that can search the web for information, analyze documents and files, and provide comprehensive research summaries on various topics.
```

**Data Analysis Agent:**

```
Create a data analysis agent that specializes in processing data files, executing Python code for statistical analysis, and generating insights from datasets.
```

**Content Creator:**

```
Create a content creation assistant that can research topics online, analyze reference materials, and help write articles, blog posts, and marketing content.
```

## 🛠️ Platform-Specific Startup

### Windows Users

```powershell
# PowerShell
.\start_backend.ps1

# Or Command Prompt
python start_backend.py
```

### Mac/Linux Users

```bash
# Make executable first
chmod +x start_backend.sh

# Run
./start_backend.sh
```

### Using npm scripts

```bash
# Start backend only
npm run backend

# Complete setup and run
npm run setup
```

## 📋 Agent Types You Can Create

### 1. Code Assistant

**Description:** "Create a Python coding assistant that helps with code review, debugging, testing, and can execute code to validate solutions"

**Selected Tools:** Tool, Code Execution, File Analysis

### 2. Research Assistant

**Description:** "Create a research assistant that can search the web, analyze documents, and provide comprehensive research summaries"

**Selected Tools:** Web Search, File Analysis

### 3. Data Analyst

**Description:** "Create a data analysis agent that processes files, executes Python code for analysis, and generates insights from datasets"

**Selected Tools:** Tool, Code Execution, File Analysis

### 4. Content Creator

**Description:** "Create a content creation assistant that researches topics online and helps write articles and marketing content"

**Selected Tools:** Web Search, File Analysis

### 5. Technical Writer

**Description:** "Create a technical documentation assistant that analyzes code files and helps create comprehensive documentation"

**Selected Tools:** Tool, Code Execution, File Analysis

## 🔧 Integration with AI Agent App

After generating your agent configuration:

1. **Open your AI Agent App**
2. **Navigate to "Agent Creation Section"**
3. **Copy the generated values:**
   - Copy `agent_name` → **Agent Name** field
   - Copy `agent_description` → **Agent Description** field
   - Copy `system_prompt` → **Agent System Prompt** field
   - Copy `query_prompt` → **Agent Query Prompt** field
4. **Select tools in Config YAML Checkboxes:**
   - Check **Tool** if `tool1: true`
   - Check **Web Search** if `webSearch: true`
   - Check **Code Execution** if `codeExecution: true`
   - Check **File Analysis** if `fileAnalysis: true`
5. **Click "Create Agent"**

## 📊 Sample Output

```json
{
  "agent_name": "Python Code Review Assistant",
  "agent_description": "A specialized coding assistant that helps developers with Python code review, debugging, and best practices.",
  "system_prompt": "You are a Python Code Review Assistant...",
  "query_prompt": "When reviewing code, always start by...",
  "selected_tools": {
    "tool1": true,
    "webSearch": false,
    "codeExecution": true,
    "fileAnalysis": true
  },
  "reasoning": "Selected code execution and file analysis for code review capabilities..."
}
```

## ❓ Troubleshooting

### "OpenAI API key not found"

- Set the environment variable: `export OPENAI_API_KEY=your-key`
- Or pass it directly: `--api-key your-key`

### "Module 'openai' not found"

```bash
pip install openai
```

### "JSON parsing error"

- Check your internet connection
- Verify your API key is valid
- Try running the script again

## 💡 Tips for Better Agents

1. **Be Specific:** Include details about the agent's role and capabilities
2. **Mention Tools:** If you need specific tools, mention them in the description
3. **Include Context:** Describe the use cases and expected interactions
4. **Iterate:** Run the script multiple times with refined descriptions

## 🧪 Test Before Using

Run the test script to verify everything works:

```bash
python test_agent_creation.py
```

## 📞 Need Help?

1. Check the detailed `AGENT_CREATION_README.md`
2. Run the test script to verify setup
3. Try the example agents first
4. Use interactive mode for experimentation

---

**Ready to create your first agent? Run this command:**

```bash
python create_agent_with_gpt.py -d "Describe what you want your agent to do"
```
