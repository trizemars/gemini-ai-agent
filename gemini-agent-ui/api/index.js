require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-it-later';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

app.use(cors());
app.use(express.json());

// In-memory database for users - NOTE: This will reset on every serverless function invocation.
const users = [];
// In-memory store for password reset tokens
const resetTokens = {};

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find(u => u.username === decoded.username);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- API Endpoints ---

// Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login a user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Forgot password - request a reset token
app.post('/api/forgot-password', (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.json({ message: 'If a user with that username exists, a password reset link has been sent.' });
  }
  const resetToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' });
  resetTokens[username] = resetToken;
  console.log(`Password reset token for ${username}: ${resetToken}`);
  res.json({ message: 'Password reset token generated. In this demo, check the console.' });
});

// Reset password using a token
app.post('/api/reset-password', async (req, res) => {
    const { username, token, newPassword } = req.body;
    if (!resetTokens[username] || resetTokens[username] !== token) {
        return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    try {
        jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        delete resetTokens[username];
        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
});


// Protected chat endpoint
app.post('/api/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ message: "Error communicating with AI" });
  }
});

// Export the app for Vercel
module.exports = app;
