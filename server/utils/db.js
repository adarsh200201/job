const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    // eslint-disable-next-line no-console
    console.warn('MONGO_URI not set. API will run but database operations will fail until configured.');
    return;
  }
  mongoose.connection.once('open', () => {
    // Ensure critical indexes are built in background
    const Job = require('../models/Job');
    const AptitudeQuestion = require('../models/AptitudeQuestion');
    const UserProgress = require('../models/UserProgress');
    const MockTest = require('../models/MockTest');

    Job.createIndexes().catch(err => console.error('Error building Job indexes:', err));
    AptitudeQuestion.createIndexes().catch(err => console.error('Error building AptitudeQuestion indexes:', err));
    UserProgress.createIndexes().catch(err => console.error('Error building UserProgress indexes:', err));
    MockTest.createIndexes().catch(err => console.error('Error building MockTest indexes:', err));
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}

module.exports = { connectDB };
