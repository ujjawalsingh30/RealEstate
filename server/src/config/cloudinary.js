import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

/**
 * @desc Initialize Cloudinary Configuration
 */
const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name') {
      console.log(`✅ Cloudinary connected successfully (Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME})`);
    } else {
      console.warn(`⚠️ Cloudinary placeholder detected. Please add real CLOUDINARY_CLOUD_NAME credentials in server/.env for live image uploading.`);
    }
  } catch (error) {
    console.error('❌ Cloudinary configuration error:', error.message);
  }
};

/**
 * @desc Helper utility to upload file Buffer directly from Multer memory storage to Cloudinary
 * @param {Buffer} fileBuffer - The binary buffer from req.file.buffer
 * @param {String} folder - Cloudinary folder name (e.g. 'properties' or 'avatars')
 * @returns {Promise<Object>} Cloudinary upload result object containing secure_url and public_id
 */
export const uploadToCloudinary = (fileBuffer, folder = 'real_estate') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error('No file buffer provided for Cloudinary upload.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    // Stream buffer into Cloudinary uploader
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * @desc Helper utility to delete an image from Cloudinary using its public_id
 * @param {String} publicId - Cloudinary public_id of the image
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Deletion Error:', error);
    throw error;
  }
};

export { cloudinary, connectCloudinary };
export default connectCloudinary;
