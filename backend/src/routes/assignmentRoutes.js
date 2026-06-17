const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/course/:courseId', protect, assignmentController.getCourseAssignments);
router.post('/', protect, authorize('teacher', 'admin'), assignmentController.createAssignment);
router.delete('/:id', protect, authorize('teacher', 'admin'), assignmentController.deleteAssignment);

module.exports = router;
