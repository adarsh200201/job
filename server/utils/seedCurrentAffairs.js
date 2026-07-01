const CurrentAffair = require('../models/CurrentAffair');

async function seedCurrentAffairsIfNeeded() {
  try {
    const count = await CurrentAffair.countDocuments();
    if (count === 0) {
      console.log('ℹ Seeding initial Current Affairs data...');
      const initialData = [
        {
          title: 'India successfully launches GSAT-20 Communications Satellite via SpaceX Falcon 9',
          category: 'Science & Tech',
          date: new Date('2026-06-12'),
          summary: 'ISRO successfully deployed the high-throughput GSAT-20 communication satellite using SpaceX\'s Falcon 9 launch vehicle, marking the first commercial launch collaboration between ISRO and SpaceX.',
          source: 'Space Commission India'
        },
        {
          title: 'Reserve Bank of India (RBI) holds repo rate steady at 6.5% for fifth consecutive session',
          category: 'Economy',
          date: new Date('2026-06-10'),
          summary: 'The Monetary Policy Committee (MPC) of the RBI voted unanimously to keep the policy repo rate unchanged, keeping focus on aligning inflation durably to the 4% target while supporting growth.',
          source: 'Reserve Bank of India'
        },
        {
          title: 'Dr. Soumya Swaminathan appointed as the Chairperson of National Health Commission',
          category: 'National',
          date: new Date('2026-06-08'),
          summary: 'The government of India announced the appointment of renowned medical researcher Dr. Soumya Swaminathan to lead the restructured National Health Commission to oversee health policy reforms.',
          source: 'Ministry of Health'
        },
        {
          title: 'G7 Summit 2026: World Leaders sign historic clean energy transmission pact in Italy',
          category: 'International',
          date: new Date('2026-06-05'),
          summary: 'The 52nd G7 Summit concluded with member countries signing a multilateral green energy infrastructure funding agreement aimed at accelerating clean energy exports to developing nations.',
          source: 'Global Summit Wire'
        },
        {
          title: 'India wins Gold at the World Archery Championship 2026 in Switzerland',
          category: 'Sports',
          date: new Date('2026-06-03'),
          summary: 'The Indian compound archery team defeated South Korea in a thrilling final match to claim the gold medal, registering India\'s best-ever performance at the international tournament.',
          source: 'Sports Authority of India'
        },
        {
          title: 'DRDO conducts successful flight test of new generation Agni-Prime ballistic missile',
          category: 'Science & Tech',
          date: new Date('2026-05-30'),
          summary: 'Defense Research and Development Organisation (DRDO) successfully test-fired the canisterized Agni-Prime missile off the coast of Odisha, demonstrating high-accuracy target destruction.',
          source: 'DRDO Press Release'
        }
      ];
      await CurrentAffair.insertMany(initialData);
      console.log('🎉 Current Affairs database seeding complete!');
    } else {
      console.log(`ℹ CurrentAffair: ${count} docs already exist, skipping.`);
    }
  } catch (err) {
    console.error('⚠️  Error seeding Current Affairs:', err.message);
  }
}

module.exports = { seedCurrentAffairsIfNeeded };
