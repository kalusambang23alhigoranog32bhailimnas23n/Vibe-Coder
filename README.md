# 🤖 Conversational AI Builder

A professional, full-stack application that allows users to create and interact with conversational AI bots. Features both text and voice responses powered by OpenAI's GPT-3.5 Turbo and Text-to-Speech APIs.

## ✨ Features

✅ **Text Prompts** - Enter any text prompt to start a conversation
✅ **AI-Powered Responses** - Get intelligent responses using OpenAI GPT-3.5 Turbo
✅ **Voice Synthesis** - Convert text responses to natural-sounding speech
✅ **Audio Playback** - Play, pause, and control voice responses
✅ **System Message Customization** - Configure AI behavior and personality
✅ **Real-time Status** - Server connection monitoring and health checks
✅ **Modern UI** - Clean, responsive interface with professional styling
✅ **Error Handling** - Comprehensive error handling with user feedback
✅ **Cross-Platform** - Works on desktop and mobile devices

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, consistent icons
- **React Hot Toast** - Elegant notification system
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **OpenAI API** - GPT-3.5 Turbo for text generation
- **OpenAI TTS** - Text-to-speech conversion
- **CORS** - Cross-origin resource sharing
- **File System** - Audio file management and streaming

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd bali

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
OPENAI_API_KEY=your-openai-api-key-here
PORT=5000
NODE_ENV=development
```

**Get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env` file
4. Make sure you have credits in your OpenAI account

### 3. Start the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
bali/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   └── audio/         # Generated audio files
│   ├── src/               # Source code
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Styling
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── server/                # Node.js backend
│   ├── public/            # Static file serving
│   │   └── audio/         # Generated audio files
│   ├── index.js           # Express server
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
└── README.md              # This file
```

## 🔧 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/chat` | Generate AI response with voice |
| GET | `/audio/:filename` | Stream audio files |
| DELETE | `/api/cleanup` | Clean old audio files |
| GET | `/api/config` | Server configuration info |

### POST /api/chat

**Request Body:**
```json
{
  "prompt": "Your question or prompt here",
  "systemMessage": "Optional system message to customize AI behavior"
}
```

**Response:**
```json
{
  "success": true,
  "textResponse": "AI generated text response",
  "audioUrl": "/audio/response_1234567890.mp3",
  "audioFileName": "response_1234567890.mp3",
  "timestamp": "2023-12-07T10:30:45.123Z",
  "promptLength": 25,
  "responseLength": 150
}
```

## 🎯 Usage Instructions

1. **Start the Application**: Follow the setup instructions above
2. **Enter a Prompt**: Type your question in the text area
3. **Customize Behavior** (Optional): Add a system message to customize the AI's personality
4. **Generate Response**: Click the "Send" button
5. **Read Response**: View the AI's text response
6. **Listen to Voice**: Click the play button to hear the audio version
7. **Try Again**: Use the clear button to reset and ask another question

## 🎨 UI Features

- **Gradient Background** - Modern purple gradient design
- **Glass Morphism** - Translucent white containers with shadows
- **Responsive Layout** - Adapts to different screen sizes
- **Loading States** - Spinner animations during processing
- **Status Indicators** - Color-coded connection status
- **Toast Notifications** - Real-time feedback messages
- **Accessibility** - Proper focus states and ARIA labels

## 🛠️ Development

### Running in Development Mode

```bash
# Backend with auto-restart
cd server
npm run dev

# Frontend with hot reload
cd client
npm start
```

### Available Scripts

**Backend:**
- `npm start` - Production mode
- `npm run dev` - Development mode with nodemon

**Frontend:**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## 🔐 Security Notes

- API keys are stored in environment variables
- CORS is configured for development
- Input validation on both frontend and backend
- Error messages don't expose sensitive information
- Audio files are automatically cleaned up

## 🐛 Troubleshooting

### Common Issues

1. **"Server disconnected" error**
   - Make sure the backend server is running on port 5000
   - Check if the `.env` file is configured correctly

2. **"API authentication failed"**
   - Verify your OpenAI API key is correct
   - Check if you have sufficient credits in your OpenAI account

3. **Audio not playing**
   - Check browser audio permissions
   - Ensure audio files are being generated (check server logs)

4. **CORS errors**
   - Make sure both frontend and backend are running
   - Frontend should be on port 3000, backend on port 5000

## 📝 License

This project is created for educational and demonstration purposes. Please ensure you comply with OpenAI's usage policies when using their APIs.

## 🤝 Contributing

This is a demonstration project for a job interview. Feel free to use it as a reference for your own projects!

---

**Built with ❤️ using React, Node.js, and OpenAI APIs** 