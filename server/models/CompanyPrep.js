const mongoose = require('mongoose');

const companyPrepSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    index: true
  }, // 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini', 'Deloitte', 'Amazon', 'Google', 'Microsoft'
  category: {
    type: String,
    enum: ['Aptitude', 'Coding', 'Interview'],
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  options: [String], // Empty for coding & interview questions
  answer: {
    type: String,
    required: true
  }, // Correct option / talking points / boilerplate solution code
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyPrep', companyPrepSchema);
