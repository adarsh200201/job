const AptitudeQuestion = require('../models/AptitudeQuestion');
const TechnicalQuestion = require('../models/TechnicalQuestion');
const DSAQuestion = require('../models/DSAQuestion');
const CompanyPrep = require('../models/CompanyPrep');
const GovPrep = require('../models/GovPrep');
const MockTest = require('../models/MockTest');
const UserProgress = require('../models/UserProgress');
const PrepCategory = require('../models/PrepCategory');
const PrepCompany = require('../models/PrepCompany');
const QuestionReport = require('../models/QuestionReport');
const QuestionComment = require('../models/QuestionComment');
const xlsx = require('xlsx');

/* ──────────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────────── */
const BADGE_RULES = [
  { badge: 'Aptitude Starter', condition: (p) => p.solvedQuestions.filter(q => q.category === 'Aptitude').length >= 5 },
  { badge: 'Aptitude Master',  condition: (p) => p.solvedQuestions.filter(q => q.category === 'Aptitude').length >= 30 },
  { badge: 'DSA Beginner',     condition: (p) => p.solvedQuestions.filter(q => q.category === 'DSA').length >= 3 },
  { badge: 'DSA Pro',          condition: (p) => p.solvedQuestions.filter(q => q.category === 'DSA').length >= 15 },
  { badge: 'Tech Wizard',      condition: (p) => p.solvedQuestions.filter(q => q.category === 'Technical').length >= 10 },
  { badge: 'Mock Champion',    condition: (p) => p.testHistory.length >= 3 },
  { badge: 'Streak Warrior',   condition: (p) => p.streak >= 7 },
];

async function updateBadgesAndXP(progress, xpGained) {
  progress.xp = (progress.xp || 0) + xpGained;

  // Streak logic
  const today = new Date();
  const last = progress.lastActivity ? new Date(progress.lastActivity) : null;
  if (last) {
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) progress.streak = (progress.streak || 0) + 1;
    else if (diffDays > 1) progress.streak = 1;
  } else {
    progress.streak = 1;
  }
  progress.lastActivity = today;

  // Badge unlock
  const existingBadges = new Set(progress.badges || []);
  for (const rule of BADGE_RULES) {
    if (!existingBadges.has(rule.badge) && rule.condition(progress)) {
      progress.badges.push(rule.badge);
    }
  }
}

/* ──────────────────────────────────────────────────────────────
   GET APTITUDE QUESTIONS
────────────────────────────────────────────────────────────── */
exports.getAptitude = async (req, res) => {
  try {
    const { category, topic, subCategory, difficulty, page = 1, limit = 10 } = req.query;
    const filter = { status: { $ne: 'inactive' } };
    if (category) {
      if (category === 'Quantitative Aptitude' || category === 'Aptitude') {
        filter.category = { $in: ['Aptitude', 'Quantitative Aptitude'] };
      } else if (category === 'Verbal Ability' || category === 'Verbal') {
        filter.category = { $in: ['Verbal', 'Verbal Ability'] };
      } else if (category === 'Logical Reasoning' || category === 'Reasoning') {
        filter.category = { $in: ['Reasoning', 'Logical Reasoning'] };
      } else {
        filter.category = category;
      }
    }
    
    let subCat = subCategory || topic;
    if (subCat) {
      const mappings = {
        "HCF and LCM": "Problems on H.C.F and L.C.M",
        "Averages": "Average",
        "Alligation and Mixture": "Alligation or Mixture",
        "Percentages": "Percentage",
        "Time Speed Distance": "Time and Distance",
        "Logarithms": "Logarithm",
        "Mensuration": "Area"
      };
      if (mappings[subCat]) {
        subCat = mappings[subCat];
      }
      filter.$or = [{ topic: subCat }, { subCategory: subCat }];
    }
    
    if (difficulty) filter.difficulty = difficulty;

    const total = await AptitudeQuestion.countDocuments(filter);
    const questions = await AptitudeQuestion.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v');

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAptitudeTopics = async (req, res) => {
  try {
    const activeCats = await PrepCategory.find({ status: 'active' });
    const categories = activeCats.map(c => c.name);
    const topics = [];
    activeCats.forEach(c => {
      c.subCategories.forEach(sc => {
        if (sc.status === 'active') {
          sc.topics.forEach(t => {
            if (t.status === 'active') topics.push(t.name);
          });
          topics.push(sc.name);
        }
      });
    });
    const uniqueTopics = Array.from(new Set(topics)).filter(Boolean);
    res.json({ topics: uniqueTopics, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   GET TECHNICAL QUESTIONS
────────────────────────────────────────────────────────────── */
exports.getTechnical = async (req, res) => {
  try {
    const { topic, type, difficulty, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const total = await TechnicalQuestion.countDocuments(filter);
    const questions = await TechnicalQuestion.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v');

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTechnicalTopics = async (req, res) => {
  try {
    const topics = await TechnicalQuestion.distinct('topic');
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   GET DSA QUESTIONS
────────────────────────────────────────────────────────────── */
exports.getDSA = async (req, res) => {
  try {
    const { topic, difficulty, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const total = await DSAQuestion.countDocuments(filter);
    const questions = await DSAQuestion.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v');

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDSATopics = async (req, res) => {
  try {
    const topics = await DSAQuestion.distinct('topic');
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   COMPANY PREP
────────────────────────────────────────────────────────────── */
exports.getCompany = async (req, res) => {
  try {
    const { company, category, difficulty, page = 1, limit = 10 } = req.query;
    const filter = { status: { $ne: 'inactive' } };
    if (company) filter.company = company;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    // First search in the unified AptitudeQuestion collection (since imported company questions are here)
    const count = await AptitudeQuestion.countDocuments({ ...filter, company: { $exists: true, $ne: '' } });
    if (count > 0) {
      const total = await AptitudeQuestion.countDocuments({ ...filter, company: { $exists: true, $ne: '' } });
      const questions = await AptitudeQuestion.find({ ...filter, company: { $exists: true, $ne: '' } })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-__v');
      return res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
    }

    // Fallback to legacy CompanyPrep model
    const legacyFilter = {};
    if (company) legacyFilter.company = company;
    if (category) legacyFilter.category = category;
    if (difficulty) legacyFilter.difficulty = difficulty;
    
    const total = await CompanyPrep.countDocuments(legacyFilter);
    const questions = await CompanyPrep.find(legacyFilter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v');

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCompanyList = async (req, res) => {
  try {
    const activeComps = await PrepCompany.find({ status: 'active' }).sort({ order: 1 });
    const companies = activeComps.map(c => c.name);
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   GOVERNMENT PREP
────────────────────────────────────────────────────────────── */
exports.getGov = async (req, res) => {
  try {
    const { exam, category, difficulty, page = 1, limit = 10 } = req.query;
    
    // Check if Government category questions exist in AptitudeQuestion
    const govCount = await AptitudeQuestion.countDocuments({ category: { $regex: /gov/i }, status: { $ne: 'inactive' } });
    if (govCount > 0) {
      const filter = { category: { $regex: /gov/i }, status: { $ne: 'inactive' } };
      if (exam) {
        filter.$or = [{ subCategory: exam }, { topic: exam }];
      }
      if (category) filter.category = category;
      if (difficulty) filter.difficulty = difficulty;

      const total = await AptitudeQuestion.countDocuments(filter);
      const questions = await AptitudeQuestion.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-__v');
      return res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
    }

    // Fallback to legacy GovPrep model
    const legacyFilter = {};
    if (exam) legacyFilter.exam = exam;
    if (category) legacyFilter.category = category;
    if (difficulty) legacyFilter.difficulty = difficulty;

    const total = await GovPrep.countDocuments(legacyFilter);
    const questions = await GovPrep.find(legacyFilter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v');

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExamList = async (req, res) => {
  try {
    const exams1 = await GovPrep.distinct('exam');
    const exams2 = await AptitudeQuestion.distinct('subCategory', { category: { $regex: /gov/i } });
    const exams = Array.from(new Set([...exams1, ...exams2])).filter(Boolean);
    res.json({ exams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   MOCK TESTS
────────────────────────────────────────────────────────────── */
exports.getMockTests = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const tests = await MockTest.find(filter).select('title type duration -_id').lean();
    // Return _id for navigation
    const full = await MockTest.find(filter).select('title type duration _id').lean();
    res.json({ tests: full });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMockTestById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json({ test });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   SUBMIT PROGRESS (Mark question solved / submit mock)
────────────────────────────────────────────────────────────── */
exports.markSolved = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Login required' });

    const { questionId, category, topic } = req.body;
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId, solvedQuestions: [], badges: [], testHistory: [] });
    }

    // Avoid duplicate
    const alreadySolved = progress.solvedQuestions.some(q => q.questionId === questionId);
    if (!alreadySolved) {
      progress.solvedQuestions.push({ questionId, category, topic });
      await updateBadgesAndXP(progress, 10);
    }

    await progress.save();
    res.json({ xp: progress.xp, streak: progress.streak, badges: progress.badges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitMockTest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Login required' });

    const { testId, testTitle, score, totalQuestions, correctAnswers, wrongAnswers, durationTaken } = req.body;

    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId, solvedQuestions: [], badges: [], testHistory: [] });
    }

    progress.testHistory.push({ testId, testTitle, score, totalQuestions, correctAnswers, wrongAnswers, durationTaken });
    const xpGained = Math.floor(score * 2);
    await updateBadgesAndXP(progress, xpGained);
    await progress.save();

    res.json({ xp: progress.xp, streak: progress.streak, badges: progress.badges, newBadges: progress.badges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   GET USER PROGRESS
────────────────────────────────────────────────────────────── */
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Login required' });

    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      return res.json({
        xp: 0, streak: 0, badges: [],
        solvedCount: 0, testHistory: [], recentActivity: []
      });
    }

    res.json({
      xp: progress.xp,
      streak: progress.streak,
      badges: progress.badges,
      solvedCount: progress.solvedQuestions.length,
      testHistory: progress.testHistory.slice(-10).reverse(),
      recentActivity: progress.solvedQuestions.slice(-5).reverse(),
      solvedQuestions: progress.solvedQuestions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   AI TUTOR (Gemini API or rule-based fallback)
────────────────────────────────────────────────────────────── */
exports.explainWithAI = async (req, res) => {
  try {
    const { question, options, answer, explanation, topic } = req.body;

    // Try Gemini API if key is available
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_KEY) {
      const prompt = `You are an expert tutor. Explain this question step-by-step for a student preparing for placements.

Question: ${question}
${options && options.length ? `Options: ${options.join(', ')}` : ''}
Correct Answer: ${answer}
Topic: ${topic || 'General'}

Provide:
1. Core Concept: (brief explanation of the concept)
2. Step-by-Step Solution: (detailed working)
3. Shortcut / Trick: (any time-saving approach)
4. Remember: (one key takeaway)

Keep it clear, concise, and student-friendly.`;

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return res.json({ explanation: text, source: 'ai' });
      }
    }

    // Rule-based fallback — structure the stored explanation nicely
    const formatted = `**Core Concept:**\n${topic || 'General'} — This question tests fundamental understanding.\n\n**Step-by-Step Solution:**\n${explanation}\n\n**Correct Answer:** ${answer}\n\n**Shortcut / Trick:**\nFor questions like these, identify the key formula or pattern first, then apply it systematically.\n\n**Remember:**\nPractice similar problems to build speed and accuracy for competitive exams.`;
    res.json({ explanation: formatted, source: 'rule-based' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   ADMIN PREPARATION CONTROLLER FUNCTIONS
────────────────────────────────────────────────────────────── */

exports.adminGetQuestions = async (req, res) => {
  try {
    const { category, subCategory, difficulty, status, company, q, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (subCategory && subCategory !== 'all') {
      filter.$or = [{ subCategory }, { topic: subCategory }];
    }
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (status && status !== 'all') filter.status = status;
    if (company && company !== 'all') filter.company = company;
    if (q) filter.question = { $regex: q, $options: 'i' };

    const total = await AptitudeQuestion.countDocuments(filter);
    const questions = await AptitudeQuestion.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-__v');

    res.json({ success: true, questions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminCreateQuestion = async (req, res) => {
  try {
    const q = new AptitudeQuestion(req.body);
    await q.save();
    res.json({ success: true, question: q });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminUpdateQuestion = async (req, res) => {
  try {
    const q = await AptitudeQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json({ success: true, question: q });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteQuestion = async (req, res) => {
  try {
    const q = await AptitudeQuestion.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminBulkUpdateQuestions = async (req, res) => {
  try {
    const { ids, update } = req.body;
    const result = await AptitudeQuestion.updateMany({ _id: { $in: ids } }, { $set: update });
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminBulkDeleteQuestions = async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await AptitudeQuestion.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetMockTests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await MockTest.countDocuments();
    const tests = await MockTest.find()
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ success: true, tests, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminCreateMockTest = async (req, res) => {
  try {
    const t = new MockTest(req.body);
    await t.save();
    res.json({ success: true, test: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminUpdateMockTest = async (req, res) => {
  try {
    const t = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Mock test not found' });
    res.json({ success: true, test: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteMockTest = async (req, res) => {
  try {
    const t = await MockTest.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: 'Mock test not found' });
    res.json({ success: true, message: 'Mock test deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetCategories = async (req, res) => {
  try {
    const results = await AptitudeQuestion.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const categories = results.map(r => ({ name: r._id || 'Uncategorized', count: r.count }));
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetSubCategories = async (req, res) => {
  try {
    const results = await AptitudeQuestion.aggregate([
      { $group: { _id: { category: '$category', subCategory: '$subCategory' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const subcategories = results.map(r => ({
      category: r._id.category || 'Uncategorized',
      name: r._id.subCategory || 'General',
      count: r.count
    }));
    res.json({ success: true, subcategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetRandomQuestions = async (req, res) => {
  try {
    const { category, subCategory, company, difficulty, count = 10 } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (subCategory && subCategory !== 'all') {
      filter.$or = [{ subCategory }, { topic: subCategory }];
    }
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (company && company !== 'all') filter.company = company;

    const pipeline = [];
    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }
    pipeline.push({ $sample: { size: Number(count) } });

    const questions = await AptitudeQuestion.aggregate(pipeline);
    
    // Map answer fields to look regular for MockTest questions format
    const formatted = questions.map(q => ({
      questionText: q.question,
      options: q.options,
      answer: q.correctAnswer || q.answer,
      explanation: q.explanation
    }));

    res.json({ success: true, questions: formatted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminBulkImportQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions must be an array' });
    }
    let imported = 0, skipped = 0, failed = 0;
    const errors = [];
    
    for (const q of questions) {
      const qText = q.question || q.questionText;
      const cat = q.category;
      const subCat = q.subCategory || q.topic;
      const opts = q.options;
      const ans = q.correctAnswer || q.answer;
      
      if (!qText || !cat || !subCat || !opts || !ans) {
        failed++;
        errors.push(`Validation failed for: "${qText || 'unknown'}" (missing required fields)`);
        continue;
      }
      
      // Duplicate prevention based on: Question Text, Category, Sub Category
      const existing = await AptitudeQuestion.findOne({
        question: qText,
        category: cat,
        $or: [{ subCategory: subCat }, { topic: subCat }]
      });
      
      if (existing) {
        skipped++;
        continue;
      }
      
      try {
        const newQ = new AptitudeQuestion({
          category: cat,
          subCategory: subCat,
          topic: subCat,
          question: qText,
          options: opts,
          correctAnswer: ans,
          answer: ans,
          explanation: q.explanation || 'No explanation provided.',
          difficulty: q.difficulty || 'Medium',
          company: q.company || '',
          marks: q.marks !== undefined ? Number(q.marks) : 1,
          negativeMarks: q.negativeMarks !== undefined ? Number(q.negativeMarks) : 0,
          tags: q.tags || [],
          status: q.status || 'active'
        });
        await newQ.save();
        imported++;
      } catch (err) {
        failed++;
        errors.push(`Error saving "${qText}": ${err.message}`);
      }
    }
    res.json({
      success: true,
      summary: { total: questions.length, imported, skipped, failed },
      errors
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetAnalytics = async (req, res) => {
  try {
    const totalQuestions = await AptitudeQuestion.countDocuments();
    const totalTests = await MockTest.countDocuments();
    const allProgress = await UserProgress.find({});
    
    let totalAttempts = 0;
    let totalScoreSum = 0;
    let maxScore = 0;
    
    allProgress.forEach(p => {
      totalAttempts += p.testHistory.length;
      p.testHistory.forEach(t => {
        totalScoreSum += t.score;
        if (t.score > maxScore) maxScore = t.score;
      });
    });
    
    const avgScore = totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 0;
    
    res.json({
      success: true,
      stats: {
        totalQuestions,
        totalTests,
        totalAttempts,
        avgScore,
        maxScore
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserProgress.find({})
      .sort({ xp: -1 })
      .limit(20)
      .populate('userId', 'username email');
      
    const formatted = leaderboard.map((l, idx) => ({
      rank: idx + 1,
      username: l.userId?.username || 'Guest User',
      xp: l.xp || 0,
      streak: l.streak || 0,
      badgesCount: (l.badges || []).length,
      testsCount: (l.testHistory || []).length
    }));
    
    res.json({ success: true, leaderboard: formatted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────────
   DYNAMIC STRUCTURE & CATEGORY/COMPANY CRUD & EXCEL IMPORT
   ────────────────────────────────────────────────────────────── */

exports.getStructure = async (req, res) => {
  try {
    const categories = await PrepCategory.find({ status: 'active' }).sort({ order: 1 });
    const companies = await PrepCompany.find({ status: 'active' }).sort({ order: 1 });
    res.json({ success: true, categories, companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetCategoriesTree = async (req, res) => {
  try {
    const categories = await PrepCategory.find({}).sort({ order: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminCreateCategory = async (req, res) => {
  try {
    const cat = new PrepCategory(req.body);
    await cat.save();
    res.json({ success: true, category: cat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminUpdateCategory = async (req, res) => {
  try {
    const cat = await PrepCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true, category: cat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteCategory = async (req, res) => {
  try {
    const cat = await PrepCategory.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetCompanies = async (req, res) => {
  try {
    const companies = await PrepCompany.find({}).sort({ order: 1 });
    res.json({ success: true, companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminCreateCompany = async (req, res) => {
  try {
    const comp = new PrepCompany(req.body);
    await comp.save();
    res.json({ success: true, company: comp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminUpdateCompany = async (req, res) => {
  try {
    const comp = await PrepCompany.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comp) return res.status(404).json({ message: 'Company not found' });
    res.json({ success: true, company: comp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteCompany = async (req, res) => {
  try {
    const comp = await PrepCompany.findByIdAndDelete(req.params.id);
    if (!comp) return res.status(404).json({ message: 'Company not found' });
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminExcelImportQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = xlsx.utils.sheet_to_json(worksheet);

    let imported = 0, skipped = 0, failed = 0;
    const errors = [];

    for (const row of rawRows) {
      const category = row.Category || row.category;
      const subCategory = row.SubCategory || row.subcategory || row['Sub Category'];
      const topic = row.Topic || row.topic;
      const question = row.Question || row.question || row['Question Text'] || row.questionText;
      const explanation = row.Explanation || row.explanation || 'No explanation provided.';
      const difficulty = row.Difficulty || row.difficulty || 'Medium';
      const company = row.Company || row.company || '';
      const marks = row.Marks !== undefined ? Number(row.Marks) : (row.marks !== undefined ? Number(row.marks) : 1);
      const negativeMarks = row.NegativeMarks !== undefined ? Number(row.NegativeMarks) : (row.negativeMarks !== undefined ? Number(row.negativeMarks) : 0);
      const tagsStr = row.Tags || row.tags || '';
      const status = row.Status || row.status || 'active';

      let options = [];
      const optA = row.OptionA || row.optionA || row['Option A'];
      const optB = row.OptionB || row.optionB || row['Option B'];
      const optC = row.OptionC || row.optionC || row['Option C'];
      const optD = row.OptionD || row.optionD || row['Option D'];

      if (optA !== undefined && optB !== undefined) {
        options = [String(optA), String(optB)];
        if (optC !== undefined) options.push(String(optC));
        if (optD !== undefined) options.push(String(optD));
      } else {
        const optsRaw = row.Options || row.options;
        if (optsRaw) {
          if (Array.isArray(optsRaw)) {
            options = optsRaw.map(String);
          } else if (typeof optsRaw === 'string') {
            options = optsRaw.split(/[,;\n]/).map(o => o.trim()).filter(Boolean);
          }
        }
      }

      let correctAnswer = row.CorrectAnswer || row.correctAnswer || row.Answer || row.answer;
      if (correctAnswer !== undefined) {
        correctAnswer = String(correctAnswer).trim();
        if (correctAnswer.length === 1 && ['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
          const idx = correctAnswer.toUpperCase().charCodeAt(0) - 65;
          if (options[idx]) {
            correctAnswer = options[idx];
          }
        }
      }

      if (!question || !category || !subCategory || !correctAnswer || options.length < 2) {
        failed++;
        errors.push(`Validation failed for row: ${JSON.stringify(row)} (missing question/category/subcategory/answer/options)`);
        continue;
      }

      const existing = await AptitudeQuestion.findOne({
        question: question,
        category: category,
        $or: [{ subCategory: subCategory }, { topic: subCategory }]
      });

      if (existing) {
        skipped++;
        continue;
      }

      try {
        const tags = typeof tagsStr === 'string' ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
        const newQ = new AptitudeQuestion({
          category,
          subCategory,
          topic: topic || subCategory,
          question,
          options,
          correctAnswer,
          answer: correctAnswer,
          explanation,
          difficulty,
          company,
          marks,
          negativeMarks,
          tags,
          status
        });
        await newQ.save();
        imported++;
      } catch (err) {
        failed++;
        errors.push(`Error saving question: ${err.message}`);
      }
    }

    res.json({
      success: true,
      summary: { total: rawRows.length, imported, skipped, failed },
      errors
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── MCQ Question Reports & Discussion Comments ───────────────────

exports.submitReport = async (req, res) => {
  try {
    const { questionId, questionText, category, topic, type, comment } = req.body;
    const report = new QuestionReport({
      questionId,
      questionText,
      category,
      topic,
      type,
      comment
    });
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetReports = async (req, res) => {
  try {
    const reports = await QuestionReport.find({}).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminUpdateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await QuestionReport.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestionComments = async (req, res) => {
  try {
    const comments = await QuestionComment.find({ questionId: req.params.questionId }).sort({ createdAt: 1 });
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuestionComment = async (req, res) => {
  try {
    const { questionId, comment, username } = req.body;
    const newComment = new QuestionComment({
      questionId,
      comment,
      username: username || (req.user ? req.user.username : 'Anonymous'),
      userId: req.user ? req.user.id : undefined
    });
    await newComment.save();
    res.json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


