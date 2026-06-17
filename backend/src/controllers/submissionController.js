const db = require('../config/db');
const { uploadFile } = require('../config/firebase');

// @route   POST /api/submissions
exports.submitAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.body;
        const student_id = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "Javob faylini yuklang." });
        }

        // Oldin yuborganligini tekshirish
        const check = await db.query('SELECT id FROM submissions WHERE assignment_id = $1 AND student_id = $2', [assignment_id, student_id]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: "Siz bu topshiriqqa allaqachon javob yuborgansiz." });
        }

        const fileUrl = await uploadFile(req.file, 'submissions');

        const newSubmission = await db.query(
            'INSERT INTO submissions (assignment_id, student_id, file_url) VALUES ($1, $2, $3) RETURNING *',
            [assignment_id, student_id, fileUrl]
        );

        res.status(201).json({ success: true, data: newSubmission.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/submissions/assignment/:assignmentId
// O'qituvchi topshiriqqa kelgan javoblarni ko'radi
exports.getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await db.query(
            `SELECT s.*, u.name as student_name, g.score 
             FROM submissions s 
             JOIN users u ON s.student_id = u.id 
             LEFT JOIN grades g ON s.id = g.submission_id
             WHERE s.assignment_id = $1`,
            [assignmentId]
        );
        res.json({ success: true, data: submissions.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/submissions/grade
// O'qituvchi baho qo'yadi
exports.gradeSubmission = async (req, res) => {
    try {
        const { submission_id, score, feedback } = req.body;
        
        const newGrade = await db.query(
            'INSERT INTO grades (submission_id, score, feedback, graded_by) VALUES ($1, $2, $3, $4) ON CONFLICT (submission_id) DO UPDATE SET score = $2, feedback = $3 RETURNING *',
            [submission_id, score, feedback, req.user.id]
        );

        res.json({ success: true, data: newGrade.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
