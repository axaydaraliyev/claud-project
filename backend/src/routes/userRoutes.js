const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getProfile);
router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.put('/:id/role', protect, authorize('admin'), userController.changeUserRole);

module.exports = router;
