const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGO_URI;
console.log('Connecting to:', mongoUri);

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB.');
    
    // Minimal schema
    const JobSchema = new mongoose.Schema({
      postType: String,
      isActive: Boolean,
      title: String
    }, { collection: 'jobs' });
    
    const Job = mongoose.model('JobTmp', JobSchema);
    
    const totalCount = await Job.countDocuments({});
    console.log('Total jobs in database:', totalCount);
    
    const postTypes = await Job.aggregate([
      { $group: { _id: '$postType', count: { $sum: 1 }, activeCount: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } } } }
    ]);
    
    console.log('Breakdown of postType:');
    console.log(JSON.stringify(postTypes, null, 2));
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });
