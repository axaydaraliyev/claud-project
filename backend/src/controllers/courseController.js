const db = require('../config/db');

// @route   GET /api/courses
// @desc    Barcha kurslarni ko'rish
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await db.query(
            `SELECT c.id, c.title, c.description, c.created_at, u.name as teacher_name 
             FROM courses c 
             JOIN users u ON c.teacher_id = u.id`
        );
        res.json({ success: true, data: courses.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/courses
// @desc    Yangi kurs yaratish (Faqat O'qituvchi va Admin)
exports.createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;
        const teacher_id = req.user.id; // Token orqali keladi

        const newCourse = await db.query(
            'INSERT INTO courses (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, teacher_id]
        );

        // Audit log yozish
        await db.query(
            "INSERT INTO audit_logs (user_id, action, endpoint) VALUES ($1, 'COURSE_CREATED', '/api/courses')",
            [teacher_id]
        );

        res.status(201).json({ success: true, data: newCourse.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   DELETE /api/courses/:id
// @desc    Kursni o'chirish
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // Tekshirish: O'qituvchi faqat o'z kursini o'chira oladi
        const course = await db.query('SELECT teacher_id FROM courses WHERE id = $1', [courseId]);
        if(course.rows.length === 0) return res.status(404).json({ message: "Kurs topilmadi" });

        if(req.user.role !== 'admin' && course.rows[0].teacher_id !== req.user.id) {
            return res.status(403).json({ message: "Bu kursni o'chirishga huquqingiz yo'q" });
        }

        await db.query('DELETE FROM courses WHERE id = $1', [courseId]);
        
        // Audit log
        await db.query(
            "INSERT INTO audit_logs (user_id, action, endpoint) VALUES ($1, 'COURSE_DELETED', '/api/courses')",
            [req.user.id]
        );

        res.json({ success: true, message: "Kurs muvaffaqiyatli o'chirildi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
