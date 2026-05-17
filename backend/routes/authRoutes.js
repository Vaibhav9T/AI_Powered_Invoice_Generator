import express from 'express';
import { registerUser, loginUser, getMe, updateUserProfile, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/verify/:token', verifyEmail);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(protect, getMe).put(protect, updateUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;