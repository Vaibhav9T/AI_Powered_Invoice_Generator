import User from '../models/User.js';

// ==========================================
// 1. GET USER PROFILE
// ==========================================
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        // ✅ Safely grab the ID and find the user ONCE
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("🔥 GET PROFILE ERROR:", error);
        res.status(500).json({ message: 'Server error', errorDetails: error.message });
    }
};

// ==========================================
// 2. UPDATE USER PROFILE
// ==========================================
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        // ✅ Safely grab the ID and find the user ONCE
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.businessName = req.body.businessName || user.businessName;
            user.address = req.body.address || user.address;
            user.taxId = req.body.taxId || user.taxId;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                businessName: updatedUser.businessName,
                address: updatedUser.address,
                taxId: updatedUser.taxId,
                token: req.headers.authorization.split(' ')[1] 
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("🔥 UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: 'Server error', errorDetails: error.message });
    }
};