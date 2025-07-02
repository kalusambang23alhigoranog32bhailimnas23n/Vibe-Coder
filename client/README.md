# Conversational AI Builder - Frontend

## Features

✅ **Modern React Interface** - Clean, responsive UI with professional styling
✅ **Real-time AI Chat** - Input prompts and receive instant AI responses
✅ **Voice Responses** - Text-to-speech conversion with audio playback
✅ **System Message Customization** - Configure AI behavior and personality
✅ **Loading States** - Professional loading indicators and status updates
✅ **Error Handling** - Comprehensive error handling with user-friendly messages
✅ **Toast Notifications** - Real-time feedback for user actions
✅ **Responsive Design** - Works perfectly on desktop and mobile

## Setup Instructions

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Make sure the backend server is running
The frontend expects the backend to be running on `http://localhost:5000`

## Dependencies

- **React 18** - Modern React with hooks
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **React Scripts** - Build and development tools

## Key Components

### App Component
- Main application logic
- State management for prompts, responses, and audio
- Server health checking
- Error handling and user feedback

### Features Implemented

1. **Text Input System**
   - Multi-line textarea for prompts
   - Optional system message configuration
   - Character count and validation

2. **AI Response Display**
   - Formatted text responses
   - Response metadata (timestamps, lengths)
   - Clear/reset functionality

3. **Audio System**
   - Play/pause controls
   - Audio progress indicators
   - Error handling for audio playback

4. **Status Management**
   - Server connection status
   - Loading states
   - Error states with detailed messages

## Usage

1. **Enter a Prompt**: Type your question or request in the text area
2. **Optional System Message**: Customize the AI's behavior 
3. **Send**: Click the send button to generate a response
4. **View Response**: Read the AI's text response
5. **Play Audio**: Click the play button to hear the voice response
6. **Start Fresh**: Use the clear button to reset and try again

## API Integration

The frontend communicates with the backend via these endpoints:
- `GET /api/health` - Check server status
- `POST /api/chat` - Generate AI responses
- `GET /audio/:filename` - Stream audio files 