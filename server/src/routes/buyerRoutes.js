import express from 'express';
import { registerBuyer, loginBuyer, getBuyerProfile, updateBuyerProfile } from '../controllers/buyerController.js';
import buyerAuth from '../middleware/buyerAuth.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', registerBuyer);
router.post('/login', loginBuyer);

// Protected Buyer Profile Endpoints (Requires valid Buyer JWT)
router.get('/profile', buyerAuth, getBuyerProfile);
router.put('/profile', buyerAuth, updateBuyerProfile);

export default router;
