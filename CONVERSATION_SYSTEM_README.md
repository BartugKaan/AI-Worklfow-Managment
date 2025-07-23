# AI Agent Conversation System

This document explains how to use the AI Agent Conversation System that allows you to chat with your created agents using their system and query prompts.

## 🏗️ System Architecture

### Frontend (Next.js)
- **Agent Selection**: Choose from all agents in the database via sidebar
- **Real-time Chat Interface**: Message display with user/assistant distinction
- **Message Input**: Text area with send functionality
- **Loading States**: Visual feedback during message sending

### Backend (Python FastAPI)
- **Conversation Endpoint**: `/api/conversation` - Handles chat requests
- **OpenAI Integration**: Uses GPT-4o-mini with agent's system and query prompts
- **Error Handling**: Comprehensive error responses

### Database (SQLite + Prisma)
- **Agent Storage**: All agents with their prompts and tool configurations
- **Real-time Fetching**: Agents are fetched and displayed dynamically

## 🚀 How to Use

### 1. Start the System

**Option A: Automatic Setup**
```bash
python setup_and_run.py
```

**Option B: Manual Setup**
```bash
# Terminal 1: Start Backend
python start_backend.py

# Terminal 2: Start Frontend
npm run dev
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 3. Select an Agent
1. Open the application in your browser
2. Look at the **Agents** sidebar on the left
3. Click on any agent to select it (it will become highlighted)
4. The main area will show "Selected Agent: [Agent Name]"

### 4. Start Chatting
1. Type your message in the **Message Input** area at the bottom
2. Press **Enter** or click **Send Message**
3. Wait for the agent's response (you'll see a "Thinking..." indicator)
4. Continue the conversation!

## 🎯 Features

### Agent Selection
- **All Agents Displayed**: Every agent from the database appears in the sidebar
- **Active Agent Indicator**: Selected agent is highlighted in black
- **Agent Information**: Name and description shown for each agent
- **Tool Display**: Available tools shown when no conversation is active

### Conversation Interface
- **Message History**: All messages are displayed in chronological order
- **User Messages**: Appear on the right in black bubbles
- **Agent Responses**: Appear on the left in white bubbles with borders
- **Timestamps**: Each message shows the time it was sent
- **Auto-scroll**: Conversation area scrolls to show latest messages

### Message Input
- **Rich Text Area**: Multi-line input support
- **Keyboard Shortcuts**: Press Enter to send (Shift+Enter for new line)
- **Send Button**: Click to send messages
- **Loading States**: Button shows "Sending..." during processing
- **Validation**: Send button disabled when no message or agent selected

### Smart Prompting
- **System Prompt**: Agent's core instructions and personality
- **Query Prompt**: Specific guidance for handling user interactions
- **Combined Context**: Both prompts are used together for better responses
- **Tool Awareness**: Agent knows about its available tools

## 🔧 Technical Details

### API Endpoints

**Conversation Endpoint**
```
POST http://localhost:8000/api/conversation
Content-Type: application/json

{
  "agent_id": "agent-uuid",
  "message": "User's message",
  "system_prompt": "Agent's system prompt",
  "query_prompt": "Agent's query prompt",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Response Format**
```json
{
  "success": true,
  "response": "Agent's response text",
  "error": null
}
```

### Frontend State Management
- **Messages Array**: Stores conversation history
- **Current Message**: Tracks input field content
- **Loading States**: Manages UI feedback
- **Agent Selection**: Clears conversation when agent changes

### Error Handling
- **Backend Errors**: Displayed as agent messages
- **Network Issues**: User-friendly error messages
- **API Key Issues**: Clear instructions for setup
- **Validation**: Prevents sending empty messages

## 🧪 Testing

### Test the Backend
```bash
python test_conversation.py
```

### Manual Testing
1. **Health Check**: Visit http://localhost:8000/health
2. **API Docs**: Visit http://localhost:8000/docs
3. **Agent List**: Check sidebar shows all agents
4. **Conversation**: Send a test message

### Common Issues

**"No agents displayed"**
- Check if agents exist in database: `npm run db:studio`
- Verify API endpoint: http://localhost:3000/api/agents
- Check browser console for errors

**"Backend connection failed"**
- Ensure backend is running: `python start_backend.py`
- Check port 8000 is available
- Verify CORS settings in backend

**"OpenAI API errors"**
- Set API key: `export OPENAI_API_KEY=your-key`
- Check API key validity
- Verify sufficient credits

## 📝 Example Conversations

### With a Python Code Assistant
```
User: "Can you help me debug this Python function?"
Agent: "I'd be happy to help you debug your Python function! Please share the code you're having trouble with, and I'll analyze it for potential issues..."
```

### With a Research Assistant
```
User: "I need information about renewable energy trends"
Agent: "I can help you research renewable energy trends. Let me provide you with current information and analysis on this important topic..."
```

## 🔄 Conversation Flow

1. **User selects agent** → Conversation history cleared
2. **User types message** → Input validation
3. **User sends message** → Added to conversation
4. **Frontend calls backend** → POST to `/api/conversation`
5. **Backend processes** → Uses agent's prompts with GPT-4o-mini
6. **Response received** → Added to conversation
7. **UI updates** → New message displayed

## 🎨 Customization

### Styling
- Messages use Tailwind CSS classes
- User messages: `bg-black text-white`
- Agent messages: `bg-white border border-gray-200`
- Timestamps: `text-gray-300` / `text-gray-500`

### Behavior
- **Temperature**: Controls response creativity (0.7 default)
- **Max Tokens**: Limits response length (1000 default)
- **Auto-clear**: Conversation clears when switching agents

## 🚀 Next Steps

1. **File Upload**: Implement file sharing in conversations
2. **Conversation History**: Persist conversations in database
3. **Tool Integration**: Connect agent tools to actual functionality
4. **Export Conversations**: Save chat history as files
5. **Multi-turn Context**: Maintain longer conversation context

---

**Ready to start chatting?**
1. Make sure both frontend and backend are running
2. Select an agent from the sidebar
3. Type your first message and press Enter!
