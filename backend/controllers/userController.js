import User from '../models/User.js';

// ==========================================
// 1. GET USER PROFILE
// ==========================================
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        // req.user.id comes from your protect middleware
        // .select('-password') ensures we don't accidentally send the password hash to the frontend
        const user = await User.findById(req.user.id).select('-password');

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
        const user = await User.findById(req.user.id);

        if (user) {
            // Update the fields if the frontend sent them, otherwise keep the existing data
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.businessName = req.body.businessName || user.businessName;
            user.address = req.body.address || user.address;
            user.taxId = req.body.taxId || user.taxId;

            // Optional: If you ever want to let users update their password from the profile page
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // Send back the updated user object (without the password)
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                businessName: updatedUser.businessName,
                address: updatedUser.address,
                taxId: updatedUser.taxId,
                // Keep their current login token active
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