const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { connectDB } = require('../utils/db');
const PrepCategory = require('../models/PrepCategory');

const missingTopics = [
  "Banker's Discount",
  "Boats and Streams",
  "Calendar",
  "Chain Rule",
  "Clock",
  "Compound Interest",
  "Decimal Fraction",
  "Numbers",
  "Odd Man Out and Series",
  "Partnership",
  "Pipes and Cistern",
  "Problems on Ages",
  "Problems on Numbers",
  "Problems on Trains",
  "Races and Games",
  "Simple Interest",
  "Simplification",
  "Square Root and Cube Root",
  "Stocks and Shares",
  "Surds and Indices",
  "True Discount",
  "Volume and Surface Area"
];

(async () => {
  await connectDB();
  console.log("Connected to MongoDB.");

  const category = await PrepCategory.findOne({ name: "Quantitative Aptitude" });
  if (!category) {
    console.error("Quantitative Aptitude category not found!");
    await mongoose.disconnect();
    return;
  }

  const subCategory = category.subCategories.find(sub => sub.name === "Arithmetic");
  if (!subCategory) {
    console.error("Arithmetic subcategory not found!");
    await mongoose.disconnect();
    return;
  }

  let addedCount = 0;
  let existsCount = 0;

  for (const topicName of missingTopics) {
    const existing = subCategory.topics.find(t => t.name === topicName);
    if (existing) {
      if (existing.status !== 'active') {
        existing.status = 'active';
        addedCount++;
        console.log(`Activated topic: "${topicName}"`);
      } else {
        existsCount++;
      }
    } else {
      subCategory.topics.push({
        name: topicName,
        order: subCategory.topics.length + 1,
        status: "active"
      });
      addedCount++;
      console.log(`Added topic: "${topicName}"`);
    }
  }

  if (addedCount > 0) {
    await category.save();
    console.log("Quantitative Aptitude category saved successfully!");
  } else {
    console.log("No new topics needed to be added.");
  }

  console.log(`Done! Added/Activated: ${addedCount}, Already Active: ${existsCount}`);

  await mongoose.disconnect();
})().catch(err => {
  console.error("Error updating category:", err);
  process.exit(1);
});
