const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', protect, authorize('student'), upload.single('file'), submissionController.submitAssignment);
router.get('/assignment/:assignmentId', protect, authorize('teacher', 'admin'), submissionController.getAssignmentSubmissions);
router.post('/grade', protect, authorize('teacher', 'admin'), submissionController.gradeSubmission);

module.exports = router;
