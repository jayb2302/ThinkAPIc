import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import cors from 'cors';
import { connectDB } from "./config/database";

import routes from './routes';

dotenvFlow.config();

// Create Express Application
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow Frontend access
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Connect to MongoDB
connectDB();


// Routes
app.use('/api', routes);

// // Redirect to /api
// app.use((req, res, next) => {
//     if (!req.originalUrl.startsWith('/api')) {
//         return res.redirect(`/api${req.originalUrl}`);
//     }
//     next();
// });

export function startServer() {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, function() {
        console.log(`🚀 ThinkAPIc Server is running on port ${PORT}`);
    });
}
