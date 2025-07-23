
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt started...'); // DEBUG
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Received response from server:', response.status); // DEBUG
      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed with message:', data.message); // DEBUG
        throw new Error(data.message || 'Failed to login');
      }

      console.log('Received token:', data.token); // DEBUG
      setAuthToken(data.token);
      console.log('Token has been set. Navigating to /chat...'); // DEBUG
      navigate('/chat');

    } catch (err) {
      console.error('An error occurred during login:', err); // DEBUG
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
        <p><Link to="/forgot-password">Forgot Password?</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;
