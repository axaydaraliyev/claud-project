const db = require('../config/db');

// @route   GET /api/users/profile
// @desc    O'z profilini ko'rish
exports.getProfile = async (req, res) => {
    try {
        const user = await db.query(
            `SELECT u.id, u.name, u.email, u.created_at, r.name as role 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = $1`,
            [req.user.id]
        );
        res.json({ success: true, data: user.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/users
// @desc    Barcha foydalanuvchilarni ko'rish (Faqat Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.query(
            `SELECT u.id, u.name, u.email, u.created_at, r.name as role 
             FROM users u 
             JOIN roles r ON u.role_id = r.id`
        );
        res.json({ success: true, data: users.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   PUT /api/users/:id/role
// @desc    Foydalanuvchi rolini o'zgartirish (Faqat Admin)
exports.changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name } = req.body;

        const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [role_name]);
        if (roleResult.rows.length === 0) return res.status(400).json({ message: "Bunday rol mavjud emas" });

        await db.query('UPDATE users SET role_id = $1 WHERE id = $2', [roleResult.rows[0].id, id]);

        await db.query("INSERT INTO audit_logs (user_id, action, endpoint) VALUES ($1, 'USER_ROLE_CHANGED', '/api/users/role')", [req.user.id]);

        res.json({ success: true, message: "Rol muvaffaqiyatli o'zgartirildi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
