import express from 'express';
import { adminLogin, verifyAdminToken, adminLogout, getAllSellers, updateSellerStatus, deleteSeller, getAllUsers, updateUserStatusUnified, deleteUnifiedUser } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public endpoint for admin authentication and token issuance
router.post('/login', adminLogin);

// Protected endpoints requiring a valid Admin JWT header (Bearer token or token header)
router.get('/verify', adminAuth, verifyAdminToken);
router.post('/logout', adminAuth, adminLogout);

// Seller Management Endpoints
router.get('/sellers', getAllSellers); // Temporarily bypass adminAuth for testing
router.put('/sellers/:id/status', updateSellerStatus);

// Unified User Management Endpoints
router.get('/users', getAllUsers); // Temporarily bypass adminAuth for testing
router.put('/users/:role/:id/status', updateUserStatusUnified);

export default router;
