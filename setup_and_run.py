#!/usr/bin/env python3
"""
Setup and Run Script for AI Agent App
This script sets up the environment and runs both frontend and backend
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path


def run_command(command, cwd=None, shell=True):
    """Run a command and return the result"""
    try:
        result = subprocess.run(
            command, cwd=cwd, shell=shell, capture_output=True, text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)


def check_python():
    """Check if Python is installed"""
    success, stdout, stderr = run_command("python --version")
    if success:
        print(f"✅ Python found: {stdout.strip()}")
        return True
    else:
        print("❌ Python not found. Please install Python 3.8+")
        return False


def check_node():
    """Check if Node.js is installed"""
    success, stdout, stderr = run_command("node --version")
    if success:
        print(f"✅ Node.js found: {stdout.strip()}")
        return True
    else:
        print("❌ Node.js not found. Please install Node.js")
        return False


def check_npm():
    """Check if npm is installed"""
    success, stdout, stderr = run_command("npm --version")
    if success:
        print(f"✅ npm found: {stdout.strip()}")
        return True
    else:
        print("❌ npm not found. Please install npm")
        return False


def install_python_deps():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    success, stdout, stderr = run_command("pip install -r requirements.txt")
    if success:
        print("✅ Python dependencies installed")
        return True
    else:
        print(f"❌ Failed to install Python dependencies: {stderr}")
        return False


def install_node_deps():
    """Install Node.js dependencies"""
    print("📦 Installing Node.js dependencies...")
    success, stdout, stderr = run_command("npm install")
    if success:
        print("✅ Node.js dependencies installed")
        return True
    else:
        print(f"❌ Failed to install Node.js dependencies: {stderr}")
        return False


def check_env_file():
    """Check if .env file exists"""
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file found")
        return True
    else:
        print("⚠️  .env file not found. Creating from .env.example...")
        example_file = Path(".env.example")
        if example_file.exists():
            with open(example_file, "r") as src, open(env_file, "w") as dst:
                dst.write(src.read())
            print("✅ .env file created. Please edit it with your API keys.")
            return True
        else:
            print("❌ .env.example file not found")
            return False


# def run_frontend():
#     """Run the Next.js frontend"""
#     print("🚀 Starting Next.js frontend...")
#     subprocess.run("npm run dev", shell=True)
#     # subprocess.run(["npm", "run", "dev"])


def run_frontend():
    """Run the Next.js frontend"""
    print("🚀 Starting Next.js frontend...")
    frontend_dir = Path(__file__).resolve().parent
    subprocess.run("npm run dev", shell=True, cwd=frontend_dir)


def run_backend():
    """Run the Python backend"""
    print("🚀 Starting Python backend...")
    os.environ["PYTHONPATH"] = str(Path.cwd() / "backend")
    subprocess.run([sys.executable, "start_backend.py"])


def main():
    print("🔧 AI Agent App Setup and Run")
    print("=" * 40)

    # Check prerequisites
    if not check_python():
        sys.exit(1)

    if not check_node():
        sys.exit(1)

    if not check_npm():
        sys.exit(1)

    # Check environment file
    check_env_file()

    # Install dependencies
    if not install_python_deps():
        sys.exit(1)

    if not install_node_deps():
        sys.exit(1)

    print("\n✅ Setup completed successfully!")
    print("\n🚀 Starting services...")
    print("📍 Frontend: http://localhost:3001")
    print("📍 Backend: http://localhost:8001")
    print("📖 API Docs: http://localhost:8001/docs")
    print("\n⚠️  Make sure to set your OPENAI_API_KEY in the .env file")
    print("\nPress Ctrl+C to stop both services")

    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down services...")
        sys.exit(0)

    # Start backend in a separate thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()

    # Wait a moment for backend to start
    time.sleep(3)

    # Start frontend (this will block)


if __name__ == "__main__":
    main()
