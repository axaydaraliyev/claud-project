const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/stats', protect, authorize('admin'), adminController.getStats);
router.get('/audit-logs', protect, authorize('admin'), adminController.getAuditLogs);

module.exports = router;
