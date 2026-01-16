const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false // No incluir por defecto en queries
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['google', 'email'],
    default: 'email'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  cvData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  hasPaid: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  paymentDate: {
    type: Date,
    default: null
  },
  premiumExpiresAt: {
    type: Date,
    default: null
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Método para verificar si el premium sigue activo
userSchema.methods.isPremiumActive = function() {
  if (!this.isPremium || !this.premiumExpiresAt) return false;
  return new Date() < this.premiumExpiresAt;
};

// Método para obtener días restantes de premium
userSchema.methods.getDaysRemaining = function() {
  if (!this.premiumExpiresAt) return 0;
  const now = new Date();
  const expires = new Date(this.premiumExpiresAt);
  const diffTime = expires - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Comparar password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generar token de reset password
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
