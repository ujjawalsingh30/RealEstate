import express from 'express';
import { adminLogin, verifyAdminToken, adminLogout, getAllSellers, updateSellerStatus } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public endpoint for admin authentication and token issuance
router.post('/login', adminLogin);

// Protected endpoints requiring a valid Admin JWT header (Bearer token or token header)
router.get('/verify', adminAuth, verifyAdminToken);
router.post('/logout', adminAuth, adminLogout);

// Seller Management Endpoints
router.get('/sellers', adminAuth, getAllSellers);
router.put('/sellers/:id/status', adminAuth, updateSellerStatus);

export default router;
