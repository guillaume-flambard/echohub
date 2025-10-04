# Ollama Setup for EchoHub Minerva AI

This guide shows you how to set up Ollama as the AI provider for Minerva.

## Why Ollama?

- **Free**: No API costs
- **Fast**: Runs locally on your machine
- **Private**: Your data never leaves your computer
- **Easy**: Simple installation and management
- **Great for development**: Perfect for testing and development

## Installation

### macOS

```bash
brew install ollama
```

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

Download from: https://ollama.com/download/windows

## Starting Ollama

```bash
# Start the Ollama service (in a terminal)
ollama serve
```

Keep this terminal running. Ollama will listen on `http://localhost:11434`

## Choosing a Model

For EchoHub, we recommend small, fast models:

### Recommended Models

| Model | Size | Speed | Quality | Command |
|-------|------|-------|---------|---------|
| **llama3.2:3b** | 2GB | ⚡⚡⚡ | ⭐⭐⭐ | `ollama pull llama3.2:3b` |
| **llama3.2:1b** | 1.3GB | ⚡⚡⚡⚡ | ⭐⭐ | `ollama pull llama3.2:1b` |
| **qwen2.5:3b** | 2GB | ⚡⚡⚡ | ⭐⭐⭐ | `ollama pull qwen2.5:3b` |
| **phi3.5** | 2.2GB | ⚡⚡⚡ | ⭐⭐⭐ | `ollama pull phi3.5` |

### Pull Your Chosen Model

```bash
# Recommended: Llama 3.2 3B (good balance)
ollama pull llama3.2:3b

# For even faster responses (1B model)
ollama pull llama3.2:1b

# Alternative: Qwen 2.5 3B (also excellent)
ollama pull qwen2.5:3b
```

## Configure EchoHub

Add to your `.env` file:

```bash
# Minerva AI Configuration (Ollama)
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b
```

## Test Ollama

```bash
# Test the model directly
ollama run llama3.2:3b

# Try a prompt
>>> Hello, I'm Minerva AI for EchoHub
# You should get a response

# Exit with /bye
>>> /bye
```

## Managing Models

```bash
# List installed models
ollama list

# Remove a model
ollama rm llama3.2:3b

# Check Ollama version
ollama --version

# Update Ollama
brew upgrade ollama  # macOS
# or re-run the install script on Linux
```

## Performance Tips

### 1. GPU Acceleration

Ollama automatically uses your GPU if available:
- **NVIDIA GPUs**: Automatically detected
- **Apple Silicon (M1/M2/M3)**: Automatically optimized
- **AMD GPUs**: Supported on Linux

### 2. Adjust Context Size

For faster responses with limited memory, edit your `.env`:

```bash
# Smaller context = faster responses
MINERVA_MAX_CONTEXT_MESSAGES=20
```

### 3. Use Smaller Models

If responses are slow, try a smaller model:

```bash
# Fastest option
ollama pull llama3.2:1b

# Update .env
MINERVA_AI_MODEL=llama3.2:1b
```

## Troubleshooting

### Ollama Not Responding

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama
ollama serve
```

### Model Not Found

```bash
# Verify model is pulled
ollama list

# Pull it if missing
ollama pull llama3.2:3b
```

### Slow Responses

1. Try a smaller model (1B instead of 3B)
2. Reduce conversation history (MINERVA_MAX_CONTEXT_MESSAGES=20)
3. Close other resource-intensive apps
4. Check if GPU is being used: `ollama ps`

### Out of Memory

```bash
# Use the 1B model instead
ollama pull llama3.2:1b
MINERVA_AI_MODEL=llama3.2:1b
```

## Advanced: Custom Models

You can create custom models with system prompts:

```bash
# Create a Modelfile
cat > Modelfile << 'EOF'
FROM llama3.2:3b

# Set temperature (0.0 = deterministic, 1.0 = creative)
PARAMETER temperature 0.7

# Set system prompt
SYSTEM """
You are Minerva, an AI assistant for EchoHub.
You help users manage their applications efficiently.
Be concise and helpful.
"""
EOF

# Build custom model
ollama create echohub-minerva -f Modelfile

# Use it
MINERVA_AI_MODEL=echohub-minerva
```

## Switching to Cloud AI Later

If you want to switch to Claude or GPT later:

```bash
# Switch to Anthropic Claude
MINERVA_AI_PROVIDER=anthropic
MINERVA_AI_API_KEY=sk-ant-...
MINERVA_AI_MODEL=claude-3-5-sonnet-20250219

# Or OpenAI
MINERVA_AI_PROVIDER=openai
MINERVA_AI_API_KEY=sk-...
MINERVA_AI_MODEL=gpt-4-turbo-preview
```

No code changes needed - just update the environment variables!

## Resources

- **Ollama Website**: https://ollama.com
- **Model Library**: https://ollama.com/library
- **GitHub**: https://github.com/ollama/ollama
- **Discord**: https://discord.gg/ollama
