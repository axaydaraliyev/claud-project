const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const materialRoutes = require('./src/routes/materialRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const submissionRoutes = require('./src/routes/submissionRoutes');

const app = express();

// Security Middlewares
app.use(helmet()); 
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message) {
        return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi.`);
});
