const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import OpenAI
const OpenAI = require('openai');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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' // You'll need to set this
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // For serving audio files

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Main endpoint for generating conversational AI responses
 * Accepts a text prompt and returns both text and audio response
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, systemMessage } = req.body;

    // Validate input
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ 
        error: 'Prompt is required and cannot be empty' 
      });
    }

    console.log('Received chat request:', { prompt, systemMessage });

    // Default system message for conversational AI
    const defaultSystemMessage = systemMessage || 
      "You are a helpful, friendly, and conversational AI assistant. " +
      "Provide clear, concise, and engaging responses. " +
      "Keep your responses conversational and natural, as if speaking to a friend.";

    // Step 1: Generate text response using OpenAI Chat Completion
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using GPT-3.5 for faster responses and cost efficiency
      messages: [
        {
          role: "system",
          content: defaultSystemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500, // Reasonable limit for conversational responses
      temperature: 0.7, // Balanced creativity and consistency
    });

    const textResponse = chatCompletion.choices[0].message.content;
    console.log('Generated text response:', textResponse);

    // Step 2: Generate speech from the text response
    const speech = await openai.audio.speech.create({
      model: "tts-1", // OpenAI's text-to-speech model
      voice: "alloy", // Natural sounding voice
      input: textResponse,
      speed: 1.0
    });

    // Step 3: Save the audio file
    const audioFileName = `response_${Date.now()}.mp3`;
    const audioFilePath = path.join(audioDir, audioFileName);
    
    // Convert speech response to buffer and save
    const buffer = Buffer.from(await speech.arrayBuffer());
    fs.writeFileSync(audioFilePath, buffer);

    // Step 4: Return the response with both text and audio URL
    const audioUrl = `/audio/${audioFileName}`;
    
    res.json({
      success: true,
      textResponse: textResponse,
      audioUrl: audioUrl,
      audioFileName: audioFileName,
      timestamp: new Date().toISOString(),
      promptLength: prompt.length,
      responseLength: textResponse.length
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Handle different types of errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'OpenAI API quota exceeded. Please check your API limits.',
        type: 'quota_error'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Invalid OpenAI API key. Please check your configuration.',
        type: 'auth_error'
      });
    }

    res.status(500).json({
      error: 'Internal server error while processing your request',
      type: 'server_error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Endpoint to serve audio files
 */
app.get('/audio/:filename', (req, res) => {
  const filename = req.params.filename;
  const audioFilePath = path.join(audioDir, filename);

  // Check if file exists
  if (!fs.existsSync(audioFilePath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  // Set appropriate headers for audio streaming
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Accept-Ranges', 'bytes');
  
  // Stream the audio file
  const audioStream = fs.createReadStream(audioFilePath);
  audioStream.pipe(res);
});

/**
 * Endpoint to clean up old audio files (optional maintenance)
 */
app.delete('/api/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(audioDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      
      // Delete files older than 1 hour
      if (now - stats.mtime.getTime() > oneHour) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    res.json({
      message: `Cleaned up ${deletedCount} old audio files`,
      deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    res.status(500).json({ error: 'Error cleaning up files' });
  }
});

/**
 * Get server configuration info (for debugging)
 */
app.get('/api/config', (req, res) => {
  res.json({
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    audioDirectory: audioDir,
    serverTime: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    type: 'unhandled_error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/chat',
      'GET /audio/:filename',
      'DELETE /api/cleanup',
      'GET /api/config'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Conversational AI Builder Server running on port ${PORT}`);
  console.log(`📁 Audio files directory: ${audioDir}`);
  console.log(`🔑 OpenAI API Key configured: ${!!process.env.OPENAI_API_KEY}`);
  console.log(`🌐 Server ready at http://localhost:${PORT}`);
});

module.exports = app; 