const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Existing fields (keep these for compatibility)
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // New profile fields (optional to maintain backward compatibility)
  email: { type: String, default: '' },
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  
  // Quiz statistics
  stats: {
    testsCompleted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 } // in minutes
  },
  
  // Account info
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate average score
UserSchema.virtual('averageScore').get(function() {
  if (this.stats.testsCompleted === 0) return 0;
  return Math.round(this.stats.totalScore / this.stats.testsCompleted);
});

// Update last activity
UserSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);