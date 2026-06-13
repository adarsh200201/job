const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const ctrl = require('../controllers/preparationController');

// ── Aptitude ──────────────────────────────────────────────────────
router.get('/aptitude', ctrl.getAptitude);
router.get('/aptitude/topics', ctrl.getAptitudeTopics);

// ── Technical ─────────────────────────────────────────────────────
router.get('/technical', ctrl.getTechnical);
router.get('/technical/topics', ctrl.getTechnicalTopics);

// ── DSA ───────────────────────────────────────────────────────────
router.get('/dsa', ctrl.getDSA);
router.get('/dsa/topics', ctrl.getDSATopics);

// ── Company Prep ──────────────────────────────────────────────────
router.get('/company', ctrl.getCompany);
router.get('/company/list', ctrl.getCompanyList);

// ── Government Prep ───────────────────────────────────────────────
router.get('/gov', ctrl.getGov);
router.get('/gov/exams', ctrl.getExamList);

// ── Mock Tests ────────────────────────────────────────────────────
router.get('/mock-tests', ctrl.getMockTests);
router.get('/mock-tests/:id', ctrl.getMockTestById);

const adminAuth = require('../middleware/adminAuth');

// ── Progress (auth required) ──────────────────────────────────────
router.get('/progress', auth, ctrl.getUserProgress);
router.post('/progress/solve', auth, ctrl.markSolved);
router.post('/progress/submit-test', auth, ctrl.submitMockTest);

// ── Structure (public/student-facing) ──────────────────────────────
router.get('/structure', ctrl.getStructure);

// ── AI Tutor ──────────────────────────────────────────────────────
router.post('/ai-tutor', optionalAuth, ctrl.explainWithAI);

// ── Admin Routes (adminAuth required) ──────────────────────────────
router.get('/admin/questions', adminAuth, ctrl.adminGetQuestions);
router.post('/admin/questions', adminAuth, ctrl.adminCreateQuestion);
router.put('/admin/questions/:id', adminAuth, ctrl.adminUpdateQuestion);
router.delete('/admin/questions/:id', adminAuth, ctrl.adminDeleteQuestion);
router.post('/admin/questions/bulk-import', adminAuth, ctrl.adminBulkImportQuestions);
router.post('/admin/questions/bulk-update', adminAuth, ctrl.adminBulkUpdateQuestions);
router.post('/admin/questions/bulk-delete', adminAuth, ctrl.adminBulkDeleteQuestions);

router.get('/admin/mock-tests', adminAuth, ctrl.adminGetMockTests);
router.post('/admin/mock-tests', adminAuth, ctrl.adminCreateMockTest);
router.put('/admin/mock-tests/:id', adminAuth, ctrl.adminUpdateMockTest);
router.delete('/admin/mock-tests/:id', adminAuth, ctrl.adminDeleteMockTest);

// Dynamic categories CRUD
router.get('/admin/categories-tree', adminAuth, ctrl.adminGetCategoriesTree);
router.post('/admin/categories', adminAuth, ctrl.adminCreateCategory);
router.put('/admin/categories/:id', adminAuth, ctrl.adminUpdateCategory);
router.delete('/admin/categories/:id', adminAuth, ctrl.adminDeleteCategory);

// Dynamic companies CRUD
router.get('/admin/companies', adminAuth, ctrl.adminGetCompanies);
router.post('/admin/companies', adminAuth, ctrl.adminCreateCompany);
router.put('/admin/companies/:id', adminAuth, ctrl.adminUpdateCompany);
router.delete('/admin/companies/:id', adminAuth, ctrl.adminDeleteCompany);

// Excel spreadsheet bulk upload
const multer = require('multer');
const excelUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/admin/questions/excel-import', adminAuth, excelUpload.single('file'), ctrl.adminExcelImportQuestions);

router.get('/admin/categories', adminAuth, ctrl.adminGetCategories);
router.get('/admin/subcategories', adminAuth, ctrl.adminGetSubCategories);
router.get('/admin/questions/random', adminAuth, ctrl.adminGetRandomQuestions);
router.get('/admin/analytics', adminAuth, ctrl.adminGetAnalytics);
router.get('/admin/leaderboard', adminAuth, ctrl.adminGetLeaderboard);

// Reports & Comments
router.post('/report', ctrl.submitReport);
router.get('/admin/reports', adminAuth, ctrl.adminGetReports);
router.put('/admin/reports/:id', adminAuth, ctrl.adminUpdateReportStatus);
router.get('/comments/:questionId', ctrl.getQuestionComments);
router.post('/comments', optionalAuth, ctrl.createQuestionComment);
router.delete('/comments/:id', optionalAuth, ctrl.deleteQuestionComment);

module.exports = router;
