# Changelog

All notable changes to the **Gemini AI Agent (@dev)** project will be documented in this file.

## [0.1.0] - 2025-07-22

This is the initial functional release after setting up the project structure. It includes a working backend, a React-based frontend, and core features for user authentication and interaction with the AI.

### ✨ Features

- **Backend API:** Connected the Node.js backend to the Gemini API for real-time AI responses.
- **User Authentication:** Implemented a full authentication flow (Register, Login, Forgot/Reset Password) using JWT.
- **Protected Routes:** Ensured the chat interface is only accessible to logged-in users.
- **AI Typing Indicator:** Added a user-friendly "AI is typing..." animation to improve UX during response generation.
- **Logout Functionality:** Added a logout button to clear user sessions.

### 🐛 Bug Fixes

- **Routing:** Fixed a bug where unauthenticated users could directly access the chat page. The app now correctly redirects to the login page.
- **UI State:** Corrected an issue where the typing indicator was not visible on fast networks by adding a simulated delay.
- **CSS Loading:** Fixed a critical bug where the main CSS file was not being imported, causing all style changes to be ignored.

### 🎨 UI/UX Improvements

- **Complete UI Revamp:** Replaced the initial dark theme with a warm, clear, and professional color scheme (off-white, orange, and soft blue).
- **Default to Login:** Set the application's root URL to default to the login page for a more intuitive user onboarding experience.
