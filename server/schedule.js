const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  title: { type: String, required: true }, // Custom title for this scheduled instance
  
  // Timing
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes (copied from test)
  
  // Assignment
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignToAll: { type: Boolean, default: false },
  
  // Settings
  instructions: { type: String, default: '' },
  maxAttempts: { type: Number, default: 1 },
  shuffleQuestions: { type: Boolean, default: false },
  shuffleOptions: { type: Boolean, default: false },
  
  // Status
  status: { 
    type: String, 
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled' 
  },
  
  // Creator info
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Statistics
  stats: {
    totalAssigned: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    totalStarted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  }
});

// Auto-update status based on dates
ScheduleSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status === 'cancelled') {
    return next();
  }
  
  if (now < this.startDate) {
    this.status = 'scheduled';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else if (now > this.endDate) {
    this.status = 'completed';
  }
  
  this.stats.totalAssigned = this.assignToAll ? 0 : this.assignedStudents.length;
  this.updatedAt = new Date();
  next();
});

// Check if test is available for a user
ScheduleSchema.methods.isAvailableFor = function(userId) {
  const now = new Date();
  
  if (this.status !== 'active') return false;
  if (now < this.startDate || now > this.endDate) return false;
  if (!this.assignToAll && !this.assignedStudents.includes(userId)) return false;
  
  return true;
};

module.exports = mongoose.model('Schedule', ScheduleSchema);