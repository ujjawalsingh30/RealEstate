import Property from '../models/propertyModel.js';
import Seller from '../models/sellerModel.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Add a new property
export const addProperty = async (req, res) => {
  try {
    const sellerId = req.seller.id; // From auth middleware

    // Verify seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found.' });
    }

    if (seller.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Seller account is not verified.' });
    }

    // Generate a unique display ID
    const displayId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Handle local image uploads
    const uploadedImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer, 'real_estate_properties');
          uploadedImageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          // Depending on requirements, we could fail the whole request or continue with successfully uploaded images
        }
      }
    }

    // Combine any URL-based images sent in req.body.images with newly uploaded Cloudinary URLs
    let finalImages = [];
    
    // Check if images is sent as string (from FormData)
    if (req.body.images) {
      if (typeof req.body.images === 'string') {
        try {
          finalImages = JSON.parse(req.body.images);
        } catch (e) {
          finalImages = [req.body.images]; // If it's just a single string URL
        }
      } else if (Array.isArray(req.body.images)) {
        finalImages = req.body.images;
      }
    }
    
    finalImages = [...finalImages, ...uploadedImageUrls];
    
    // First image becomes main cover (req.body.image) if not explicitly provided
    let mainImage = req.body.image;
    if (!mainImage && finalImages.length > 0) {
      mainImage = finalImages[0];
    }

    const propertyData = { ...req.body };
    
    // Parse nested objects/arrays sent as JSON strings via FormData
    ['location', 'features', 'amenities', 'images'].forEach(field => {
      if (propertyData[field] && typeof propertyData[field] === 'string') {
        try {
          propertyData[field] = JSON.parse(propertyData[field]);
        } catch (e) {
          console.error(`Error parsing ${field} from FormData:`, e);
        }
      }
    });

    const newProperty = new Property({
      ...propertyData,
      image: mainImage,
      images: finalImages,
      displayId,
      sellerId: seller._id,
      seller: {
        name: seller.name,
        initials: seller.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        verified: seller.status === 'approved',
        role: 'Verified Licensed Agent' // Can be dynamic based on your logic
      }
    });

    await newProperty.save();

    res.status(201).json({
      success: true,
      message: 'Property added successfully.',
      property: newProperty
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Could not add property.',
      error: error.message,
      stack: error.stack
    });
  }
};

// Get all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not fetch properties.' });
  }
};

// Get seller's properties
export const getSellerProperties = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const properties = await Property.find({ sellerId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching seller properties:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not fetch seller properties.' });
  }
};
