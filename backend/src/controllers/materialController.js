const db = require('../config/db');
const { uploadFile, deleteFile } = require('../config/firebase');

// @route   GET /api/materials/course/:courseId
exports.getCourseMaterials = async (req, res) => {
    try {
        const { courseId } = req.params;
        const materials = await db.query('SELECT * FROM materials WHERE course_id = $1', [courseId]);
        res.json({ success: true, data: materials.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/materials
exports.uploadMaterial = async (req, res) => {
    try {
        const { course_id, title } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Fayl yuklanmadi." });
        }

        // 1. Faylni Firebase ga yuklash
        const fileUrl = await uploadFile(req.file, 'materials');
        const fileType = req.file.mimetype.split('/')[1] || 'document';

        // 2. Bazaga yozish
        const newMaterial = await db.query(
            'INSERT INTO materials (course_id, title, file_url, file_type, uploaded_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [course_id, title, fileUrl, fileType, req.user.id]
        );

        await db.query("INSERT INTO audit_logs (user_id, action) VALUES ($1, 'MATERIAL_UPLOADED')", [req.user.id]);

        res.status(201).json({ success: true, data: newMaterial.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
    try {
        const materialId = req.params.id;
        
        const material = await db.query('SELECT * FROM materials WHERE id = $1', [materialId]);
        if (material.rows.length === 0) return res.status(404).json({ message: "Material topilmadi" });

        if(req.user.role !== 'admin' && material.rows[0].uploaded_by !== req.user.id) {
            return res.status(403).json({ message: "Sizda huquq yo'q" });
        }

        // Firebase dan o'chirish
        await deleteFile(material.rows[0].file_url);

        // Bazadan o'chirish
        await db.query('DELETE FROM materials WHERE id = $1', [materialId]);
        
        await db.query("INSERT INTO audit_logs (user_id, action) VALUES ($1, 'MATERIAL_DELETED')", [req.user.id]);

        res.json({ success: true, message: "Material o'chirildi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
