
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const TypingIndicator = () => (
  <div className="message agent">
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

// Helper function to introduce a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { token, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const chatWindowRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    setAuthToken(null); // Clear token from context and local storage
    navigate('/login');
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }
      alert(`File uploaded successfully: ${data.path}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    const currentInput = input;
    setInput('');

    try {
      // Increased delay to ensure typing indicator is always visible
      await sleep(1000); // 1 second delay

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (response.status === 401) {
        // If token is invalid, force logout
        setAuthToken(null);
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const agentMessage = { text: data.reply, sender: 'agent' };
      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error("Error fetching from backend:", error);
      const errorMessage = { text: error.message || 'Error: Could not connect to the backend.', sender: 'agent' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gemini AI Agent</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button type="button" onClick={() => fileInputRef.current.click()}>Upload</button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping}>Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
