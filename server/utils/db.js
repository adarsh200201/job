const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    // eslint-disable-next-line no-console
    console.warn('MONGO_URI not set. API will run but database operations will fail until configured.');
    return;
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}

module.exports = { connectDB };
