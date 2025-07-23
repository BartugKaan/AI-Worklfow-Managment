# AI Agent Creation with GPT-4.1-mini

This Python script automatically generates AI agent configurations using GPT-4.1-mini (gpt-4o-mini) model. It creates all the necessary components for your AI Agent App including agent name, description, system prompt, query prompt, and tool selection.

## Features

- **Automated Agent Generation**: Uses GPT-4.1-mini to generate comprehensive agent configurations
- **Tool Selection**: Automatically selects appropriate tools based on agent requirements
- **English Output**: All generated content is in English
- **JSON Export**: Saves configuration as JSON for easy integration
- **Comprehensive Prompts**: Generates detailed system and query prompts

## Available Tools

The script can select from these tools available in your AI Agent App:

- **Tool**: General purpose tool for basic operations
- **Web Search**: Web search capability for finding information online
- **Code Execution**: Code execution capability for running and testing code
- **File Analysis**: File analysis capability for processing and analyzing files

## Installation

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Set up your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Or you can pass it directly when running the script.

## Usage

### Basic Usage

```bash
python create_agent_with_gpt.py -d "Create an agent that helps with Python code review and debugging"
```

### Advanced Usage

```bash
python create_agent_with_gpt.py \
  --description "Create a research assistant that can search the web and analyze documents" \
  --output my_research_agent.json \
  --api-key your-api-key-here
```

### Command Line Arguments

- `--description` or `-d`: **Required** - Description of what you want your agent to do
- `--output` or `-o`: Output JSON file name (default: `agent_config.json`)
- `--api-key`: OpenAI API key (optional if set as environment variable)

## Example Descriptions

Here are some example descriptions you can use:

### Code Assistant

```bash
python create_agent_with_gpt.py -d "Create a coding assistant that helps with Python development, code review, debugging, and can execute code to test solutions"
```

### Research Assistant

```bash
python create_agent_with_gpt.py -d "Create a research assistant that can search the web for information, analyze documents, and provide comprehensive research summaries"
```

### Data Analyst

```bash
python create_agent_with_gpt.py -d "Create a data analysis agent that can process files, execute Python code for data analysis, and generate insights from datasets"
```

### Content Creator

```bash
python create_agent_with_gpt.py -d "Create a content creation assistant that can research topics online and help write articles, blog posts, and marketing content"
```

## Output Format

The script generates a comprehensive configuration including:

1. **Agent Name**: Professional, descriptive name
2. **Agent Description**: Brief 1-2 sentence description
3. **System Prompt**: Detailed instructions (200-500 words) defining the agent's role and behavior
4. **Query Prompt**: Default instructions for handling user interactions
5. **Tool Selection**: Automatically selected tools based on agent requirements
6. **Reasoning**: Explanation of why specific tools were chosen

## Integration with AI Agent App

After generating the configuration:

1. Open your AI Agent App
2. Go to the "Agent Creation Section"
3. Copy the generated values into the corresponding fields:
   - Agent Name → Agent Name field
   - Agent Description → Agent Description field
   - System Prompt → Agent System Prompt field
   - Query Prompt → Agent Query Prompt field
   - Tool Selection → Check the appropriate Config YAML Checkboxes

## Example Output

```
================================================================================
GENERATED AGENT CONFIGURATION
================================================================================

AGENT NAME: Python Code Review Assistant

AGENT DESCRIPTION:
A specialized coding assistant that helps developers with Python code review, debugging, testing, and best practices implementation.

SYSTEM PROMPT:
You are a Python Code Review Assistant, an expert-level AI designed to help developers improve their Python code quality...

QUERY PROMPT:
When reviewing code or answering questions, always start by understanding the context and requirements...

SELECTED TOOLS:
  - Tool: ✓ SELECTED
  - Web Search: ✗ NOT SELECTED
  - Code Execution: ✓ SELECTED
  - File Analysis: ✓ SELECTED

TOOL SELECTION REASONING:
Selected Code Execution for testing and validating code solutions, File Analysis for reviewing code files and structure...
================================================================================
```

## Troubleshooting

### API Key Issues

- Make sure your OpenAI API key is valid and has sufficient credits
- Set the environment variable: `export OPENAI_API_KEY="your-key"`
- Or pass it directly: `--api-key your-key`

### JSON Parsing Errors

- The script automatically handles markdown code blocks in responses
- If you encounter parsing errors, check your internet connection and try again

### Model Availability

- The script uses `gpt-4o-mini` model (GPT-4.1-mini equivalent)
- Make sure your API key has access to this model

## Tips for Better Results

1. **Be Specific**: Provide detailed descriptions of what you want your agent to do
2. **Include Context**: Mention the domain, use cases, and expected interactions
3. **Specify Tools**: If you know you need specific capabilities, mention them in the description
4. **Iterate**: You can run the script multiple times with refined descriptions

## License

This script is part of the AI Agent App project and follows the same licensing terms.
