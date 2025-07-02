# Conversational AI Builder - Server

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server directory with:
```
OPENAI_API_KEY=your-openai-api-key-here
PORT=5000
NODE_ENV=development
```

### 3. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env` file

### 4. Run the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Generate AI response (text + voice)
- `GET /audio/:filename` - Serve audio files
- `DELETE /api/cleanup` - Clean old audio files
- `GET /api/config` - Server configuration info

## Features

- ✅ OpenAI GPT-3.5 Turbo for text generation
- ✅ OpenAI TTS for voice synthesis
- ✅ Audio file management
- ✅ CORS enabled for frontend
- ✅ Error handling and validation
- ✅ Automatic cleanup of old audio files 