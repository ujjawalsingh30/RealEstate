import express from 'express';
import { registerSeller, loginSeller, getSellerProfile, updateSellerProfile } from '../controllers/sellerController.js';
import sellerAuth from '../middleware/sellerAuth.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', registerSeller);
router.post('/login', loginSeller);

// Protected Seller Profile Endpoints (Requires valid Seller JWT)
router.get('/profile', sellerAuth, getSellerProfile);
router.put('/profile', sellerAuth, updateSellerProfile);

export default router;
