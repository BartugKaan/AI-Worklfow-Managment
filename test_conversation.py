#!/usr/bin/env python3
"""
Test script for conversation functionality
This script tests the conversation endpoint without making actual API calls
"""

import requests
import json
import os

def test_conversation_endpoint():
    """Test the conversation endpoint"""
    
    # Test data
    test_request = {
        "agent_id": "test-agent-id",
        "message": "Hello, can you help me with Python programming?",
        "system_prompt": "You are a helpful Python programming assistant. You help users with coding questions, debugging, and best practices.",
        "query_prompt": "When responding to queries, provide clear explanations and code examples when appropriate.",
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        # Test the conversation endpoint
        response = requests.post(
            "http://localhost:8000/api/conversation",
            json=test_request,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("✅ Conversation endpoint test passed!")
                print(f"Response: {result.get('response', '')[:100]}...")
                return True
            else:
                print(f"❌ Conversation endpoint returned error: {result.get('error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the backend is running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error testing conversation endpoint: {e}")
        return False

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed!")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def main():
    print("🧪 Testing AI Agent Conversation System")
    print("=" * 50)
    
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Warning: OPENAI_API_KEY not set. Conversation test may fail.")
        print("   Set your API key: export OPENAI_API_KEY=your-key-here")
        print()
    
    # Test backend health
    if not test_health_endpoint():
        print("\n💡 To start the backend:")
        print("   python start_backend.py")
        return
    
    print()
    
    # Test conversation endpoint
    if test_conversation_endpoint():
        print("\n🎉 All tests passed! The conversation system is working.")
        print("\n📝 Next steps:")
        print("   1. Open http://localhost:3000 in your browser")
        print("   2. Select an agent from the sidebar")
        print("   3. Start chatting in the Message Input area")
    else:
        print("\n❌ Conversation test failed. Check your OpenAI API key and backend logs.")

if __name__ == "__main__":
    main()
