import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Initialize Express
const app = express();

// Trust proxy (required for Render deployment to properly handle IPs)
app.set('trust proxy', 1);

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins. 
        // For tighter security in production, replace with: ['http://localhost:5173', 'https://your-frontend.com']
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Explicitly handle pre-flight OPTIONS requests for all routes
// app.options('/.*/', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send('API is running on Render...');
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));