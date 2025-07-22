
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }
            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Forgot Password</h2>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <p>Enter your username to receive a password reset token in the backend console (for this demo).</p>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <button type="submit">Request Reset Token</button>
                <p><Link to="/login">Back to Login</Link></p>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
