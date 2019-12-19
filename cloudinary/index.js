const crypto = require('crypto');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'ConsoleLog/PostImages',
  allowedFormats: ['jpeg', 'jpg', 'png'],
  transformation: [{ width: 200, quality: 'auto:best' }],
  filename: (req, file, cb) => {
    let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
    let uniqFilename = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, '');
    uniqFilename += buf;
    cb(undefined, uniqFilename);
  }
});

module.exports = { cloudinary, storage };
