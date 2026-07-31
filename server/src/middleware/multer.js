import multer from 'multer';

// Utilize memory storage to directly stream image buffers to Cloudinary without local temp file cleanup issues
const storage = multer.memoryStorage();

// Validate file type before processing
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only image files (jpg, jpeg, png, webp) are permitted.'), false);
  }
};

// Configured multer instance with 5MB file size limit per image
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum file size
  },
  fileFilter
});

export default upload;
