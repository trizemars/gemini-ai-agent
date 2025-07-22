
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const agentMessage = { text: data.reply, sender: 'agent' };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error fetching from backend:", error);
      const errorMessage = { text: 'Error: Could not connect to the backend.', sender: 'agent' };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInput('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gemini AI Agent</h1>
      </header>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
