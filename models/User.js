const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    prompts:{    
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Prompt'
    },
    refreshToken:{
        type:String,
        default:""
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
    this.refreshToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return this.refreshToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 