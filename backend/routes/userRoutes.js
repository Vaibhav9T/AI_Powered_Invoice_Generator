import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes share the exact same path ('/profile'), 
// but one is a GET request and one is a PUT request!
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;