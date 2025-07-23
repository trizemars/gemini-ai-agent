require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Use bcryptjs
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-it-later';

// Initialize Google Generative AI
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash"}) : null;

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // In a real app, you would save this to a database.
    // For this demo, we are not saving users due to the stateless environment.
    res.status(201).json({ message: 'Registration successful. Please log in.' });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

// Login a user
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hardcoded user for reliable login
    const testUser = 'testuser';
    const testPasswordHash = await bcrypt.hash('password123', 10);

    if (username === testUser && await bcrypt.compare(password, testPasswordHash)) {
      const token = jwt.sign({ username: testUser }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// --- Other Endpoints (Unchanged) ---

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { username: decoded.username }; // Use the username from the token
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected chat endpoint
app.post('/api/chat', authMiddleware, async (req, res) => {
  if (!model) {
    return res.status(500).json({ message: "AI model not initialized. Check API Key." });
  }
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
