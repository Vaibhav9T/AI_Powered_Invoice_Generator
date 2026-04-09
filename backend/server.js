import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app=express();
app.use(express.urlencoded({ extended: true }));

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

connectDB();

app.use(json());

app.use('/api/auth', authRoutes );
app.use('/api/invoices', invoiceRoutes );
app.use('/api/ai', aiRoutes );
const port=process.env.PORT||5000;
app.listen(port, ()=>console.log('Server running on port '+port));