#!/bin/bash

echo "🚀 Starting AI Agent Creation Backend"
echo "====================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3 and try again"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  .env file not found. Creating from .env.example..."
        cp .env.example .env
        echo "✅ .env file created. Please edit it with your API keys."
    else
        echo "❌ Neither .env nor .env.example file found"
        exit 1
    fi
fi

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ] && ! grep -q "OPENAI_API_KEY=" .env; then
    echo "⚠️  Warning: OPENAI_API_KEY not found in environment or .env file"
    echo "Please set your OpenAI API key in the .env file"
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""
echo "🚀 Starting backend server..."
echo "📍 Backend: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the backend
python3 start_backend.py
