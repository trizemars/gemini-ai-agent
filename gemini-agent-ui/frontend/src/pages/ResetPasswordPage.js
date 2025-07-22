
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ResetPasswordPage() {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, token, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Reset Password</h2>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Reset Token from Console" required />
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required />
                <button type="submit">Reset Password</button>
                <p><Link to="/login">Back to Login</Link></p>
            </form>
        </div>
    );
}

export default ResetPasswordPage;
