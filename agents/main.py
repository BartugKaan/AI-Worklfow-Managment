from fastapi import FastAPI, HTTPException, Body, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
from datetime import datetime
import os
import openai
import json
from dotenv import load_dotenv

# Modüler yapı için diğer modülleri import et
from src.utils import (
    load_environment,
    initialize_openai_client,
    logger,
)
from src.models import (
    WorkflowBase,
    Agent,
    WorkflowExecutionResult,
    WorkflowExecuteRequest,
)
from src.agents import get_default_agents, process_with_agent
from src.workflow import execute_workflow_pipeline

# Çevresel değişkenler
load_environment()
load_dotenv()  # Agent creation için ek dotenv yükleme
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
openai_client = initialize_openai_client()

# FastAPI uygulaması
app = FastAPI(title="AI Agent Creation & Workflow API", version="2.0.0")

# CORS ayarları - her iki uygulama için gerekli origin'leri dahil et
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory veritabanı
DB = {"workflows": [], "agents": []}

# Başlangıçta örnek ajanları ekle
DB["agents"] = get_default_agents()


# Agent creation için yeni Pydantic modelleri
class AgentCreationRequest(BaseModel):
    description: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2000


class ToolSelection(BaseModel):
    tool1: bool
    webSearch: bool
    codeExecution: bool
    fileAnalysis: bool


class AgentConfiguration(BaseModel):
    agent_name: str
    agent_description: str
    system_prompt: str
    query_prompt: str
    selected_tools: ToolSelection
    reasoning: str


class AgentCreationResponse(BaseModel):
    success: bool
    data: Optional[AgentConfiguration] = None
    error: Optional[str] = None


class ConversationRequest(BaseModel):
    agent_id: str
    message: str
    system_prompt: str
    query_prompt: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000


class ConversationResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None


# Agent Creator Class
class AgentCreator:
    def __init__(self, client: openai.OpenAI):
        self.client = client
        self.available_tools = {
            "tool1": "General purpose tool for basic operations",
            "webSearch": "Web search capability for finding information online",
            "codeExecution": "Code execution capability for running and testing code",
            "fileAnalysis": "File analysis capability for processing and analyzing files",
        }

    def create_agent_prompt(self, user_description: str) -> str:
        """Create the prompt for GPT-4.1-mini to generate agent configuration"""
        return f"""
You are an AI agent configuration generator. Based on the user's description, create a comprehensive agent configuration.

User Description: "{user_description}"

Available Tools:
- Tool: General purpose tool for basic operations
- Web Search: Web search capability for finding information online  
- Code Execution: Code execution capability for running and testing code
- File Analysis: File analysis capability for processing and analyzing files

Generate a JSON response with the following structure:
{{
    "agent_name": "A concise, descriptive name for the agent",
    "agent_description": "A brief 1-2 sentence description of what the agent does",
    "system_prompt": "Detailed system instructions that define the agent's role, behavior, and capabilities. Should be comprehensive and specific.",
    "query_prompt": "Default instructions for how the agent should handle user queries and interactions",
    "selected_tools": {{
        "tool1": true/false,
        "webSearch": true/false, 
        "codeExecution": true/false,
        "fileAnalysis": true/false
    }},
    "reasoning": "Brief explanation of why these tools were selected for this agent"
}}

Requirements:
1. All text must be in English
2. Be specific and detailed in prompts
3. Select tools that are most relevant to the agent's purpose
4. System prompt should be comprehensive (200-500 words)
5. Query prompt should provide clear guidance for user interactions
6. Agent name should be professional and descriptive
"""

    def generate_agent_config(
        self, user_description: str, temperature: float = 0.7, max_tokens: int = 2000
    ) -> Dict[str, Any]:
        """Generate agent configuration using GPT-4.1-mini"""
        try:
            prompt = self.create_agent_prompt(user_description)

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Using gpt-4o-mini as it's the available model
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert AI agent configuration generator. Always respond with valid JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )

            # Parse the JSON response
            config_text = response.choices[0].message.content.strip()

            # Remove markdown code blocks if present
            if config_text.startswith("```json"):
                config_text = config_text[7:]
            if config_text.endswith("```"):
                config_text = config_text[:-3]

            config = json.loads(config_text.strip())
            return config

        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500, detail=f"Error parsing JSON response: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error generating agent config: {str(e)}"
            )


# OpenAI client için yardımcı fonksiyon
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    return openai.OpenAI(api_key=api_key)


# Root endpoint'ler
@app.get("/")
async def root():
    return {"message": "AI Agent Creation & Workflow API", "version": "2.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-agent-creation-workflow-api"}


# Ajan endpoint'leri
@app.get("/agents")
async def get_agents():
    """Tüm ajanları listeler."""
    return DB["agents"]


@app.post("/agents")
async def create_agent(agent: Agent):
    """Yeni bir ajan oluşturur."""
    # Use provided ID if available, otherwise generate new one
    agent_id = getattr(agent, "id", None) or str(uuid.uuid4())
    new_agent = {
        "id": agent_id,
        "name": agent.name,
        "description": agent.description or "",
        "prompt": agent.prompt,
        "created_at": datetime.utcnow(),
    }

    DB["agents"].append(new_agent)
    logger.info(f"Yeni ajan oluşturuldu: {agent.name}")

    return new_agent


@app.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Belirli bir ajanın detaylarını getirir."""
    for agent in DB["agents"]:
        if agent["id"] == agent_id:
            return agent

    raise HTTPException(status_code=404, detail="Ajan bulunamadı")


@app.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Bir ajanı siler."""
    for i, agent in enumerate(DB["agents"]):
        if agent["id"] == agent_id:
            del DB["agents"][i]
            logger.info(f"Ajan silindi: {agent['name']}")
            return {"message": "Ajan başarıyla silindi"}

    raise HTTPException(status_code=404, detail="Ajan bulunamadı")


# Yeni Agent Creation endpoint'leri
@app.post("/api/generate-agent", response_model=AgentCreationResponse)
async def generate_agent(request: AgentCreationRequest):
    """Generate an AI agent configuration based on user description"""
    try:
        # Get OpenAI client
        client = get_openai_client()

        # Create agent creator
        creator = AgentCreator(client)

        # Generate configuration
        config = creator.generate_agent_config(
            request.description, request.temperature, request.max_tokens
        )

        # Validate and structure the response
        agent_config = AgentConfiguration(
            agent_name=config.get("agent_name", ""),
            agent_description=config.get("agent_description", ""),
            system_prompt=config.get("system_prompt", ""),
            query_prompt=config.get("query_prompt", ""),
            selected_tools=ToolSelection(
                tool1=config.get("selected_tools", {}).get("tool1", False),
                webSearch=config.get("selected_tools", {}).get("webSearch", False),
                codeExecution=config.get("selected_tools", {}).get(
                    "codeExecution", False
                ),
                fileAnalysis=config.get("selected_tools", {}).get(
                    "fileAnalysis", False
                ),
            ),
            reasoning=config.get("reasoning", ""),
        )

        return AgentCreationResponse(success=True, data=agent_config)

    except HTTPException:
        raise
    except Exception as e:
        return AgentCreationResponse(success=False, error=str(e))


@app.post("/api/conversation", response_model=ConversationResponse)
async def chat_with_agent(request: ConversationRequest):
    """Chat with an AI agent using its system and query prompts"""
    try:
        # Get OpenAI client
        client = get_openai_client()

        # Combine system prompt and query prompt for context
        system_message = f"{request.system_prompt}\n\n{request.query_prompt}"

        # Create the conversation
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": request.message},
            ],
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        # Extract the response
        agent_response = response.choices[0].message.content.strip()

        return ConversationResponse(success=True, response=agent_response)

    except Exception as e:
        return ConversationResponse(success=False, error=str(e))


@app.get("/api/tools")
async def get_available_tools():
    """Get list of available tools"""
    return {
        "tools": [
            {
                "id": "tool1",
                "name": "Tool",
                "description": "General purpose tool for basic operations",
            },
            {
                "id": "webSearch",
                "name": "Web Search",
                "description": "Web search capability for finding information online",
            },
            {
                "id": "codeExecution",
                "name": "Code Execution",
                "description": "Code execution capability for running and testing code",
            },
            {
                "id": "fileAnalysis",
                "name": "File Analysis",
                "description": "File analysis capability for processing and analyzing files",
            },
        ]
    }


# İş akışı endpoint'leri
@app.post("/workflows")
async def create_workflow(workflow: WorkflowBase):
    """Yeni iş akışı oluşturur veya mevcut iş akışını günceller."""
    if workflow.id:
        # Mevcut workflow'u güncelle
        for i, wf in enumerate(DB["workflows"]):
            if wf["id"] == workflow.id:
                updated_workflow = {
                    "id": workflow.id,
                    "name": workflow.name,
                    "description": workflow.description,
                    "nodes": [node.dict() for node in workflow.nodes],
                    "edges": [edge.dict() for edge in workflow.edges],
                    "user_id": wf.get("user_id", "demo_user"),
                    "created_at": wf["created_at"],
                    "updated_at": datetime.utcnow(),
                }
                DB["workflows"][i] = updated_workflow
                logger.info(f"İş akışı güncellendi: {workflow.name}")
                return updated_workflow

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="İş akışı bulunamadı",
        )

    # Yeni workflow oluştur
    workflow_id = str(uuid.uuid4())
    try:
        new_workflow = {
            "id": workflow_id,
            "name": workflow.name,
            "description": workflow.description,
            "nodes": [node.dict() for node in workflow.nodes],
            "edges": [edge.dict() for edge in workflow.edges],
            "user_id": "demo_user",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        DB["workflows"].append(new_workflow)
        logger.info(f"Yeni iş akışı oluşturuldu: {workflow.name}")

        return new_workflow
    except Exception as e:
        logger.error(f"İş akışı oluşturma hatası: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"İş akışı oluşturulamadı: {str(e)}",
        )


@app.get("/workflows")
async def get_workflows():
    """Tüm iş akışlarını listeler."""
    return DB["workflows"]


@app.get("/workflows/{workflow_id}")
async def get_workflow(workflow_id: str):
    """Belirli bir iş akışının detaylarını getirir."""
    for workflow in DB["workflows"]:
        if workflow["id"] == workflow_id:
            return workflow

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="İş akışı bulunamadı",
    )


@app.delete("/workflows/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """Bir iş akışını siler."""
    for i, workflow in enumerate(DB["workflows"]):
        if workflow["id"] == workflow_id:
            workflow_name = workflow["name"]
            del DB["workflows"][i]
            logger.info(f"İş akışı silindi: {workflow_name}")
            return {"message": "İş akışı başarıyla silindi"}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="İş akışı bulunamadı",
    )


# İş akışı yürütme endpoint'i
@app.post("/workflows/{workflow_id}/execute", response_model=WorkflowExecutionResult)
async def execute_workflow(
    workflow_id: str, execute_request: WorkflowExecuteRequest = Body(...)
):
    """Bir iş akışını yürütür."""
    # İş akışını bul
    workflow = None
    for wf in DB["workflows"]:
        if wf["id"] == workflow_id:
            workflow = wf
            break

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="İş akışı bulunamadı"
        )

    # API anahtarını kontrol et
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API anahtarı sunucu tarafında tanımlanmamış. Lütfen sunucu yöneticisine başvurun.",
        )

    # İş akışını yürüt
    result = execute_workflow_pipeline(
        workflow=workflow,
        input_text=execute_request.input_text,
        db=DB,
        openai_client=openai_client,
        openai_api_key=OPENAI_API_KEY,
        process_with_agent_fn=process_with_agent,
    )

    # Sonucu döndür
    return WorkflowExecutionResult(
        workflow_id=result["workflow_id"],
        results=result["results"],
        execution_time=result["execution_time"],
        status=result["status"],
    )


if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting AI Agent Creation & Workflow API...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Alternative docs: http://localhost:8000/redoc")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
