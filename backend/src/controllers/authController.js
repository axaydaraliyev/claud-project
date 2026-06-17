const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role_name } = req.body;

        // Role ID ni olish
        const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [role_name || 'student']);
        if (roleResult.rows.length === 0) {
            return res.status(400).json({ message: "Noto'g'ri rol kiritildi." });
        }
        const role_id = roleResult.rows[0].id;

        // User bor-yo'qligini tekshirish
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Bu email ro'yxatdan o'tgan." });
        }

        // Parolni hash qilish
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Yangi foydalanuvchini bazaga qo'shish
        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [name, email, password_hash, role_id]
        );

        res.status(201).json({ success: true, user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await db.query(
            `SELECT u.*, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.email = $1`,
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Email yoki parol noto'g'ri." });
        }

        const user = userResult.rows[0];

        // Parolni tekshirish
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Email yoki parol noto'g'ri." });
        }

        // JWT Token yaratish
        const payload = {
            user: {
                id: user.id,
                role: user.role_name
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });

        res.json({ success: true, token, user: { id: user.id, name: user.name, role: user.role_name } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
