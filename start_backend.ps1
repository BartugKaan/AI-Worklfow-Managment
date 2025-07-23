Write-Host "🚀 Starting AI Agent Creation Backend" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python and try again" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created. Please edit it with your API keys." -ForegroundColor Green
    } else {
        Write-Host "❌ Neither .env nor .env.example file found" -ForegroundColor Red
        exit 1
    }
}

# Check if OpenAI API key is set
$envKeySet = $env:OPENAI_API_KEY -ne $null -and $env:OPENAI_API_KEY -ne ""
$fileKeySet = (Get-Content ".env" -ErrorAction SilentlyContinue) -match "OPENAI_API_KEY="

if (-not $envKeySet -and -not $fileKeySet) {
    Write-Host "⚠️  Warning: OPENAI_API_KEY not found in environment or .env file" -ForegroundColor Yellow
    Write-Host "Please set your OpenAI API key in the .env file" -ForegroundColor Yellow
}

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Blue
try {
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        throw "pip install failed"
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host "📍 Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the backend
python start_backend.py
