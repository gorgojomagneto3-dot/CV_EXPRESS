const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
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

module.exports = mongoose.model('User', userSchema);
