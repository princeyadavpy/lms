# HiGen Labs Test Conductor Platform

An enterprise-grade assessment platform for coding tests and MCQ exams, featuring proctoring, live monitoring, and a comprehensive admin/teacher dashboard.

## Features
- **Proctoring**: Fullscreen enforcement, tab switching detection, copy/paste prevention, warning logging.
- **Roles**: Admin, Teacher, Student, Recruiter.
- **Exams**: Coding questions (with multi-language support and hidden test cases) and MCQs.
- **Dashboards**: Live monitoring for teachers, detailed submission reports for admins, and a student result portal.

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`
3. Create a `.env` file based on the environment variables below.
4. Start the server: `npm start` (or `npm run dev`)

### Frontend Setup
1. Navigate to the `client` folder.
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

## Environment Variables (.env)

Create a `.env` file in the `backend/` directory with the following keys:

```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/higenlabs
JWT_SECRET=your_super_secret_jwt_key
SESSION_SECRET=your_session_secret_key

# Google OAuth Credentials (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Judge0 Execution Engine URL (Optional, uses Mock Engine if empty)
# Local Docker: http://localhost:2358
# Cloud API: https://judge0-ce.p.rapidapi.com 
JUDGE0_URL=
```

## Code Execution (Judge0) Setup

By default, the platform uses a **Mock Execution Engine** so you can develop without needing a code runner.
To run *real* Python, Java, C++, and JavaScript code against hidden test cases, you need to connect to [Judge0](https://github.com/judge0/judge0).

### Option 1: Run Judge0 Locally (Recommended for Development)
You need Docker and Docker Compose installed on your machine.

1. Download the Judge0 Docker Compose configuration:
   ```bash
   wget https://github.com/judge0/judge0/releases/download/v1.13.0/judge0-v1.13.0.zip
   unzip judge0-v1.13.0.zip
   cd judge0-v1.13.0
   ```
2. Start the services:
   ```bash
   docker-compose up -d db redis
   sleep 10s
   docker-compose up -d
   sleep 5s
   ```
3. Update your `backend/.env` file:
   ```ini
   JUDGE0_URL=http://localhost:2358
   ```

### Option 2: Use Hosted Judge0 API (RapidAPI)
If you don't want to run Docker, you can use the free hosted tier via RapidAPI.

1. Go to [Judge0 API on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to the free Basic plan (50 requests/day).
3. Get the RapidAPI Key and update your backend code (in `executeController.js`) to send the `X-RapidAPI-Key` header with your requests, and update `.env`:
   ```ini
   JUDGE0_URL=https://judge0-ce.p.rapidapi.com
   ```

