import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Play, Pause, MessageSquare, Volume2, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import './index.css';

/**
 * Main Conversational AI Builder Application
 * Features:
 * - Text input for prompts
 * - AI-powered text responses via OpenAI
 * - Text-to-speech conversion
 * - Audio playback functionality
 * - Clean, modern UI with loading states
 * - Error handling and user feedback
 */
function App() {
  // State management
  const [prompt, setPrompt] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  
  // Audio reference for playback control
  const audioRef = useRef(null);

  /**
   * Check server health on component mount
   */
  useEffect(() => {
    checkServerHealth();
  }, []);

  /**
   * Check if the backend server is running and accessible
   */
  const checkServerHealth = async () => {
    try {
      const response = await axios.get('/api/health');
      if (response.data.status) {
        setServerStatus('connected');
        toast.success('Connected to AI server!');
      }
    } catch (error) {
      setServerStatus('disconnected');
      toast.error('Unable to connect to AI server. Please check if the server is running.');
    }
  };

  /**
   * Handle form submission to generate AI response
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!prompt.trim()) {
      toast.error('Please enter a prompt!');
      return;
    }

    // Check server connection
    if (serverStatus !== 'connected') {
      toast.error('Server is not connected. Please check your backend.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Show loading toast
      const loadingToast = toast.loading('Generating AI response...');

      // Send request to backend
      const result = await axios.post('/api/chat', {
        prompt: prompt.trim(),
        systemMessage: systemMessage.trim() || undefined
      });

      if (result.data.success) {
        setResponse(result.data);
        toast.success('AI response generated successfully!', { id: loadingToast });
        
        // Clear the prompt after successful submission
        setPrompt('');
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Handle different error types
      let errorMessage = 'Failed to generate response. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 429) {
        errorMessage = 'API rate limit exceeded. Please wait a moment and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'API authentication failed. Please check your API key configuration.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle audio playback
   * Toggle between play and pause states
   */
  const handleAudioPlay = () => {
    if (!response?.audioUrl) {
      toast.error('No audio available to play');
      return;
    }

    try {
      if (audioRef.current) {
        if (audioPlaying) {
          // Pause audio
          audioRef.current.pause();
          setAudioPlaying(false);
          toast('Audio paused');
        } else {
          // Play audio
          audioRef.current.play();
          setAudioPlaying(true);
          toast.success('Playing audio response');
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio. Please try again.');
    }
  };

  /**
   * Handle audio events
   */
  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  const handleAudioError = () => {
    setAudioPlaying(false);
    toast.error('Error loading audio file');
  };

  /**
   * Clear the current response and start fresh
   */
  const clearResponse = () => {
    setResponse(null);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };

  /**
   * Get status indicator component
   */
  const getStatusIndicator = () => {
    if (serverStatus === 'checking') {
      return (
        <div className="status-indicator warning">
          <Loader size={16} className="loading-spinner" />
          Checking server connection...
        </div>
      );
    } else if (serverStatus === 'connected') {
      return (
        <div className="status-indicator success">
          <CheckCircle size={16} />
          Connected to AI server
        </div>
      );
    } else {
      return (
        <div className="status-indicator error">
          <AlertCircle size={16} />
          Server disconnected - Please start the backend server
        </div>
      );
    }
  };

  return (
    <div className="app">
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="header">
        <h1>🤖 Conversational AI Builder</h1>
        <p>Create intelligent chatbots with text and voice responses</p>
      </header>

      {/* Main chat interface */}
      <main className="chat-container">
        {/* Server status indicator */}
        {getStatusIndicator()}

        {/* Input section */}
        <section className="input-section">
          <form onSubmit={handleSubmit}>
            {/* System message input (optional) */}
            <div>
              <label htmlFor="system-message" className="system-message-label">
                System Message (Optional)
              </label>
              <input
                id="system-message"
                type="text"
                className="system-message-input"
                placeholder="Customize the AI's behavior (e.g., 'You are a helpful cooking assistant')"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Main prompt input */}
            <div className="input-group">
              <textarea
                className="prompt-input"
                placeholder="Enter your prompt here... (e.g., 'Explain how machine learning works in simple terms')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                rows={3}
                maxLength={1000}
                required
              />
              <button
                type="submit"
                className="send-button"
                disabled={loading || !prompt.trim() || serverStatus !== 'connected'}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="loading-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Character count */}
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
            {prompt.length}/1000 characters
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <div className="loading">
            <Loader size={24} className="loading-spinner" />
            <span>Generating your AI response with voice...</span>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="error">
            <AlertCircle size={20} style={{ marginRight: '10px' }} />
            {error}
          </div>
        )}

        {/* Response section */}
        {response && (
          <section className="response-section">
            <div className="response-header">
              <MessageSquare size={20} />
              <span>AI Response</span>
              <button 
                onClick={clearResponse}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>

            {/* Text response */}
            <div className="response-text">
              {response.textResponse}
            </div>

            {/* Audio controls */}
            {response.audioUrl && (
              <div className="audio-controls">
                <button
                  className="play-button"
                  onClick={handleAudioPlay}
                  title={audioPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {audioPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <div className="audio-info">
                  <h4>🎵 Voice Response</h4>
                  <p>
                    {audioPlaying ? 'Playing...' : 'Click to hear the AI response'}
                    {response.audioFileName && ` • ${response.audioFileName}`}
                  </p>
                </div>

                <Volume2 size={20} style={{ color: '#667eea' }} />
              </div>
            )}

            {/* Hidden audio element */}
            {response.audioUrl && (
              <audio
                ref={audioRef}
                src={response.audioUrl}
                onEnded={handleAudioEnded}
                onError={handleAudioError}
                preload="auto"
              />
            )}

            {/* Response metadata */}
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              background: '#f0f0f0', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <strong>Response Details:</strong><br />
              Generated at: {new Date(response.timestamp).toLocaleString()}<br />
              Prompt length: {response.promptLength} characters<br />
              Response length: {response.responseLength} characters
            </div>
          </section>
        )}

        {/* Instructions */}
        {!response && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontStyle: 'italic',
            marginTop: '20px'
          }}>
            💡 Enter a prompt above to start a conversation with the AI.<br />
            You'll receive both text and voice responses!
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: 'auto', 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px'
      }}>
        <p>Built with React, Node.js, and OpenAI API</p>
        <p>Featuring GPT-3.5 Turbo for text and OpenAI TTS for voice</p>
      </footer>
    </div>
  );
}

export default App; 