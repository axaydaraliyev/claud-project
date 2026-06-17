const multer = require('multer');

// Xotirada saqlash (RAM), chunki biz faylni to'g'ridan-to'g'ri Firebase ga jo'natamiz
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Ruxsat etilgan fayl turlari
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Faqat PDF, DOC, DOCX, PPT, PPTX va Rasmlar (JPG/PNG) yuklash mumkin!"), false);
    }
  }
});

module.exports = upload;
