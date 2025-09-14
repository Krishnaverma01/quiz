const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctAnswer: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
  points: { type: Number, default: 1 }
});

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Programming', 'Mathematics', 'Science', 'General', 'Other'],
    default: 'General' 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate' 
  },
  duration: { type: Number, required: true }, // in minutes
  questions: [QuestionSchema],
  status: { 
    type: String, 
    enum: ['draft', 'active', 'scheduled', 'archived'],
    default: 'draft' 
  },
  maxScore: { type: Number, default: 0 }, // calculated from questions
  passScore: { type: Number, default: 60 }, // percentage
  
  // Creator info
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Test settings
  settings: {
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    showResults: { type: Boolean, default: true },
    allowRetake: { type: Boolean, default: false },
    timeLimit: { type: Boolean, default: true }
  }
});

// Calculate max score before saving
TestSchema.pre('save', function(next) {
  this.maxScore = this.questions.reduce((total, question) => total + question.points, 0);
  this.updatedAt = new Date();
  next();
});

// Get question count
TestSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

module.exports = mongoose.model('Test', TestSchema);