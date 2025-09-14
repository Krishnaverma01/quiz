const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  isCorrect: { type: Boolean, required: true },
  points: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 } // seconds spent on this question
});

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  
  // Score info
  score: { type: Number, required: true, default: 0 },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, required: true, default: 0 },
  
  // Question details
  answers: [AnswerSchema],
  correctAnswers: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  
  // Time info
  timeStarted: { type: Date, required: true },
  timeCompleted: { type: Date, required: true },
  timeTaken: { type: Number, required: true }, // in minutes
  
  // Status
  status: { 
    type: String, 
    enum: ['completed', 'abandoned', 'timeout'],
    default: 'completed' 
  },
  
  // Pass/Fail
  passed: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

// Calculate percentage and pass status before saving
ResultSchema.pre('save', function(next) {
  this.percentage = Math.round((this.score / this.maxScore) * 100);
  this.correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
  // Assuming pass threshold is stored in test, for now using 60%
  this.passed = this.percentage >= 60;
  next();
});

// Get grade based on percentage
ResultSchema.virtual('grade').get(function() {
  if (this.percentage >= 90) return 'A';
  if (this.percentage >= 80) return 'B';
  if (this.percentage >= 70) return 'C';
  if (this.percentage >= 60) return 'D';
  return 'F';
});

module.exports = mongoose.model('Result', ResultSchema);