const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { connectDB } = require('../utils/db');

const AptitudeQuestionSchema = new mongoose.Schema({}, { strict: false });
const AptitudeQuestion = mongoose.model('AptitudeQuestion', AptitudeQuestionSchema, 'aptitudequestions');

(async () => {
  await connectDB();
  
  const results = await AptitudeQuestion.aggregate([
    {
      $group: {
        _id: { category: "$category", topic: "$topic" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.category": 1, "_id.topic": 1 }
    }
  ]);
  
  console.log('\n=== Aptitude Questions by Category and Topic ===');
  results.forEach(r => {
    console.log(`${r._id.category} -> ${r._id.topic}: ${r.count} questions`);
  });
  
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
