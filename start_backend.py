#!/usr/bin/env python3
"""
Startup script for the AI Agent Creation Backend
This script starts the FastAPI backend with uvicorn
"""

import uvicorn
import os
import sys
from pathlib import Path

def main():
    # Add backend directory to Python path
    backend_dir = Path(__file__).parent / "backend"
    sys.path.insert(0, str(backend_dir))
    
    # Check for required environment variables
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Warning: OPENAI_API_KEY environment variable not set")
        print("   Please set your OpenAI API key:")
        print("   export OPENAI_API_KEY=your-api-key-here")
        print()
    
    print("🚀 Starting AI Agent Creation Backend...")
    print("📍 Backend will be available at: http://localhost:8000")
    print("📖 API documentation at: http://localhost:8000/docs")
    print("🔄 Auto-reload enabled for development")
    print()
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(backend_dir)],
        log_level="info"
    )

if __name__ == "__main__":
    main()
