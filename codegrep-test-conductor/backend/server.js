const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Passport config (Google OAuth)
require('./config/passport')(passport);

const BASE_URL = process.env.BASE_URL || '/lms';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || '.higenlabs.in';

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.APP_URL,
    'https://higenlabs.in',
    'https://higenlabs.in/lms',
    'http://localhost:3001',
    'http://localhost:5173'
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.higenlabs.in')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

// Attach socket
require('./sockets/socketManager')(io);

// ── Security Middleware ────────────────────────────────────────────
app.use(helmet());
app.set('trust proxy', 1);

// Global rate limiter: 100 requests per minute per IP
const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, msg: 'Too many requests, please slow down.' }
});

// Stricter limiter for auth routes: 10 per minute
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, msg: 'Too many auth attempts, please try again in a minute.' }
});

app.use(globalLimiter);

// ── Core Middleware ────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'higenlab_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? COOKIE_DOMAIN : undefined,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Routes ────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const questionRoutes = require('./routes/questions');
const executeRoutes = require('./routes/execute');
const submissionRoutes = require('./routes/submissions');
const proctoringRoutes = require('./routes/proctoring');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');
const orgRoutes = require('./routes/organizations');

// Mount routes under configured BASE_URL prefix (e.g. /lms/api) as well as /api fallback
const lmsApiPrefix = `${BASE_URL}/api`.replace(/\/+/g, '/');
const prefixes = Array.from(new Set([lmsApiPrefix, '/api']));

prefixes.forEach(prefix => {
    app.use(`${prefix}/auth`, authLimiter, authRoutes);
    app.use(`${prefix}/tests`, testRoutes);
    app.use(`${prefix}/questions`, questionRoutes);
    app.use(`${prefix}/execute`, executeRoutes);
    app.use(`${prefix}/submissions`, submissionRoutes);
    app.use(`${prefix}/proctoring`, proctoringRoutes);
    app.use(`${prefix}/projects`, projectRoutes);
    app.use(`${prefix}/admin`, adminRoutes);
    app.use(`${prefix}/organizations`, orgRoutes);
    app.get(`${prefix}/health`, (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), baseUrl: BASE_URL }));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 HiGen Labs Server running on port ${PORT}`);
});
