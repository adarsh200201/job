const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { connectDB } = require('../utils/db');
const PrepCategory = require('../models/PrepCategory');

(async () => {
  await connectDB();
  
  const categories = await PrepCategory.find({ status: 'active' }).sort({ order: 1 });
  
  console.log('\n=== Prep Categories and Topics in DB ===');
  categories.forEach(cat => {
    console.log(`\nCategory: ${cat.name} (order: ${cat.order})`);
    cat.subCategories.forEach(sub => {
      if (sub.status === 'active') {
        console.log(`  SubCategory: ${sub.name}`);
        const activeTopics = sub.topics.filter(t => t.status === 'active');
        activeTopics.forEach(topic => {
          console.log(`    - Topic: ${topic.name}`);
        });
      }
    });
  });
  
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
