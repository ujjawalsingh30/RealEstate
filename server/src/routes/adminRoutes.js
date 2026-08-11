import express from 'express';
import { adminLogin, verifyAdminToken, adminLogout, getAllSellers, updateSellerStatus, deleteSeller, getAllUsers, updateUserStatusUnified, deleteUnifiedUser, getAdminStats, changeAdminPassword } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public endpoint for admin authentication and token issuance
router.post('/login', adminLogin);

// Protected endpoints requiring a valid Admin JWT header (Bearer token or token header)
router.get('/verify', adminAuth, verifyAdminToken);
router.post('/logout', adminAuth, adminLogout);

// Dashboard Stats Endpoint
router.get('/stats', adminAuth, getAdminStats);

// Seller Management Endpoints
router.get('/sellers', adminAuth, getAllSellers);
router.put('/sellers/:id/status', adminAuth, updateSellerStatus);

// Unified User Management Endpoints
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:role/:id/status', adminAuth, updateUserStatusUnified);
router.put('/change-password', adminAuth, changeAdminPassword);

export default router;
