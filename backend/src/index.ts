import express from 'express';
import cors from 'cors'; // Import the cors package
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use cookie-parser middleware
app.use(cookieParser());

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Apply cookie-session middleware
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY as string],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
