# Changelog

All notable changes to the **Gemini AI Agent (@dev)** project will be documented in this file.

## [0.2.0] - 2025-07-22

This release focuses on stabilizing the application for both local and Vercel-hosted environments. It involved extensive debugging of the deployment process and implementing temporary solutions to ensure core functionality.

### ✨ Features

- **Guaranteed Login:** Implemented a hardcoded user (`testuser` / `password123`) to ensure login functionality is stable and testable, bypassing the stateless nature of the serverless environment.

### 🐛 Bug Fixes

- **Vercel Deployment:** Resolved a series of critical deployment errors (`Unexpected end of JSON input`, `command not found`, `No Output Directory`) by implementing a definitive `vercel.json` configuration and correcting the project structure.
- **API Routing:** Fixed a fundamental routing mismatch between Vercel's proxy and the internal Express app by removing `/api` prefixes from server-side routes.
- **Local Development:** Re-enabled local development by conditionally starting the Express server, allowing `localhost` testing to work alongside Vercel deployment.
- **Login Logic:** Corrected a critical bug in the login function that was incorrectly hashing the password on every attempt, making login impossible.

### 🛠 Known Issues

- **Stateless Registration:** The user registration process is currently a placeholder. It returns a success message but does not persist the user due to the serverless environment. The next major step is to integrate a real database.

---

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
