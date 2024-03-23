// middleware/sessionMiddleware.js
import session from 'express-session';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Do not save session if not modified
    saveUninitialized: false, // Do not save new sessions with no data
    cookie: {
        maxAge: 5 * 60 * 1000 // Session expires after 5 minutes (in milliseconds)
    }
});

export default sessionMiddleware;