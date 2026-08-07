import express from 'express';
import { addProperty, getProperties, getSellerProperties } from '../controllers/propertyController.js';
import sellerAuth from '../middleware/sellerAuth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);

// Protected routes for sellers
router.post('/', sellerAuth, upload.array('localImages', 10), addProperty);
router.get('/seller-listings', sellerAuth, getSellerProperties);

export default router;
