const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/course/:courseId', protect, materialController.getCourseMaterials);
router.post('/', protect, authorize('teacher', 'admin'), upload.single('file'), materialController.uploadMaterial);
router.delete('/:id', protect, authorize('teacher', 'admin'), materialController.deleteMaterial);

module.exports = router;
