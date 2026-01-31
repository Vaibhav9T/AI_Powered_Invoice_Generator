const jwt= require('jsonwebtoken');
const User= require('./models/User');

// Helper: Generate JWT
const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, {
expiresIn: "7d",
});
};

exports. registerUser = async (req, res) => {
const { name, email, password } = req.body;

try {
} catch (error) {
res.status (500) . json({ message: "Server error" });
}
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
};



exports.getMe = async (req, res) => {
    try {
} catch (error) {
res.status (500) . json({ message: "Server error" });
}
};

exports.updateUserProfile = async (req, res) => {
    try {
} catch (error) {
res.status (500) . json({ message: "Server error" });
}
};



