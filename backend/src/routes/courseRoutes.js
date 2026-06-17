const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, courseController.getAllCourses);
router.post('/', protect, authorize('teacher', 'admin'), courseController.createCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), courseController.deleteCourse);

module.exports = router;
