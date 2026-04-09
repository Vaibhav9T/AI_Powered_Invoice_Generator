import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields" });
        }
        
        const existingUser = await User.findOne({ email });
        
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const user = new User({ name, email, password });
        await user.save();

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("🔥 REGISTRATION ERROR:", error); 
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),

                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
        
    } catch (error) {
        console.error("🔥 LOGIN ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),

                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
        
    } catch (error) {
        console.error("🔥 GET ME ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.businessName = req.body.businessName || user.businessName;
            user.address = req.body.address || user.address;
            user.phone = req.body.phone || user.phone;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                businessName: updatedUser.businessName,
                address: updatedUser.address,
                phone: updatedUser.phone,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
        
    } catch (error) {
        console.error("🔥 UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: "Server error", errorDetails: error.message });
    }
};