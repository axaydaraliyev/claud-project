const db = require('../config/db');

// @route   GET /api/assignments/course/:courseId
exports.getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await db.query('SELECT * FROM assignments WHERE course_id = $1', [courseId]);
        res.json({ success: true, data: assignments.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/assignments
exports.createAssignment = async (req, res) => {
    try {
        const { course_id, title, description, deadline } = req.body;
        
        const newAssignment = await db.query(
            'INSERT INTO assignments (course_id, title, description, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
            [course_id, title, description, deadline]
        );

        res.status(201).json({ success: true, data: newAssignment.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   DELETE /api/assignments/:id
exports.deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM assignments WHERE id = $1', [id]);
        res.json({ success: true, message: "Topshiriq o'chirildi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
