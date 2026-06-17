const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Firebase xizmat kaliti (Firebase konsolida olingan json fayl yoki ENV o'zgaruvchilari orqali)
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'educloud-secure.appspot.com'
});

const bucket = admin.storage().bucket();

/**
 * Faylni Firebase Storage-ga yuklash
 * @param {Object} file - multer orqali olingan fayl obyekti
 * @param {String} folder - yuklanadigan papka nomi (masalan, 'materials' yoki 'submissions')
 * @returns {Promise<String>} - Yuklangan faylning URL manzili
 */
const uploadFile = async (file, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('Fayl topilmadi');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => reject(error));

    blobStream.on('finish', async () => {
      // Ommaviy URL yaratish yoki maxsus ruxsat berish
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

/**
 * Faylni Firebase Storage-dan o'chirish
 * @param {String} fileUrl - Faylning to'liq URL manzili
 */
const deleteFile = async (fileUrl) => {
    try {
        const urlObj = new URL(fileUrl);
        const filePath = decodeURIComponent(urlObj.pathname.split('/o/')[1]);
        await bucket.file(filePath).delete();
        return true;
    } catch (error) {
        console.error("Fayl o'chirishda xatolik:", error);
        return false;
    }
}

module.exports = { bucket, uploadFile, deleteFile };
