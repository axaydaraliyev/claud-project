const db = require('../config/db');

// @route   GET /api/admin/stats
// @desc    Tizim statistikasini olish
exports.getStats = async (req, res) => {
    try {
        const usersCount = await db.query('SELECT COUNT(*) FROM users');
        const coursesCount = await db.query('SELECT COUNT(*) FROM courses');
        const materialsCount = await db.query('SELECT COUNT(*) FROM materials');
        const submissionsCount = await db.query('SELECT COUNT(*) FROM submissions');

        res.json({
            success: true,
            data: {
                users: parseInt(usersCount.rows[0].count),
                courses: parseInt(coursesCount.rows[0].count),
                materials: parseInt(materialsCount.rows[0].count),
                submissions: parseInt(submissionsCount.rows[0].count),
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/admin/audit-logs
// @desc    Audit loglarni ko'rish
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await db.query(
            `SELECT a.id, a.action, a.endpoint, a.ip_address, a.created_at, u.name as user_name 
             FROM audit_logs a 
             LEFT JOIN users u ON a.user_id = u.id 
             ORDER BY a.created_at DESC LIMIT 100`
        );
        res.json({ success: true, data: logs.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
