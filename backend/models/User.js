import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    
    businessName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    taxId: { type: String, default: '' },
}, { timestamps: true,
    strict: false 
 });


// 1. Modern Async pre-save hook (No 'next' required!)
userSchema.pre("save", async function () {
    // If password is not modified, exit the function early
    if (!this.isModified("password")) return;
    
    // Otherwise, hash it
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// 2. Method to compare password (fixed spacing typo)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);