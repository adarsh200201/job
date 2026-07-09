const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGO_URI;
console.log('Connecting to:', mongoUri);

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB.');
    
    // Define QueueJob schema
    const QueueJobSchema = new mongoose.Schema({
      jobHash: String,
      jobData: Object,
      isGovernment: Boolean,
      priority: Number,
      timestamp: Number
    }, { collection: 'queuejobs' });
    
    const QueueJob = mongoose.model('QueueJobTmp', QueueJobSchema);
    
    const queueCount = await QueueJob.countDocuments({});
    console.log('Total jobs in MongoDB Queue:', queueCount);
    
    // Define SeenJob schema
    const SeenJobSchema = new mongoose.Schema({
      jobHash: String,
      timestamp: Number
    }, { collection: 'seenjobs' });
    
    const SeenJob = mongoose.model('SeenJobTmp', SeenJobSchema);
    
    const seenCount = await SeenJob.countDocuments({});
    console.log('Total seen jobs in MongoDB:', seenCount);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
