import express from 'express';
// Import your AI functions from the controller
import { 
    parseInvoiceFormatText, 
    generateReminderEmail, 
    getDashboardSummary,
    parseInvoiceFromImage
} from '../controllers/aiControllers.js'; 
import { protect } from '../middleware/authMiddleware.js';

// Import your auth middleware (assuming you have one to protect routes!)
// import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 1. The Parse Route (POST request, usually unprotected so you can test it easily)
router.post('/parse',protect, parseInvoiceFormatText);

// 2. The Image Parse Route (POST request, needs an ID)
router.post('/parse-image', protect, parseInvoiceFromImage);

// 3. The Reminder Email Route (POST request, needs an ID)
router.post('/reminder',protect, generateReminderEmail);

// 4. The Dashboard Summary Route (GET request)
router.get('/dashboard',protect, getDashboardSummary);

export default router;