import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Seller from '../models/sellerModel.js';

/**
 * @desc    Register a new Seller Account
 * @route   POST /api/seller/register
 * @access  Public
 */
export const registerSeller = async (req, res) => {
  try {
    const { name, email, password, phone, agencyName, reraNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email: cleanEmail });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: 'A Seller account with this email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new seller in MongoDB
    const newSeller = await Seller.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || '',
      agencyName: agencyName || 'Independent Realtor',
      reraNumber: reraNumber || 'Not Provided',
      status: 'pending', // Account starts as pending until Admin approves property addition
      role: 'seller',
      lastLogin: new Date()
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newSeller._id, 
        email: newSeller.email, 
        role: 'seller',
        status: newSeller.status 
      },
      process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Seller account registered successfully! Note: Your account is pending Admin verification before publishing properties.',
      token,
      role: 'seller',
      user: {
        id: newSeller._id,
        name: newSeller.name,
        email: newSeller.email,
        phone: newSeller.phone,
        agencyName: newSeller.agencyName,
        reraNumber: newSeller.reraNumber,
        status: newSeller.status,
        role: newSeller.role,
        createdAt: newSeller.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Seller Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during seller registration.',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate Seller & Generate JWT
 * @route   POST /api/seller/login
 * @access  Public
 */
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const seller = await Seller.findOne({ email: cleanEmail });

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if admin has explicitly rejected this seller
    if (seller.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your Seller account registration has been declined by Platform Administrators.'
      });
    }

    // Update lastLogin time
    seller.lastLogin = new Date();
    await seller.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: seller._id, 
        email: seller.email, 
        role: seller.role,
        status: seller.status 
      },
      process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Seller login successful!',
      token,
      role: seller.role,
      user: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        agencyName: seller.agencyName,
        reraNumber: seller.reraNumber,
        status: seller.status,
        role: seller.role,
        propertiesCount: seller.propertiesCount,
        lastLogin: seller.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Seller Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
};

/**
 * @desc    Get Current Seller Profile
 * @route   GET /api/seller/profile
 * @access  Private (Seller Only)
 */
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select('-password');
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller profile not found.' });
    }
    return res.status(200).json({ success: true, seller });
  } catch (error) {
    console.error('❌ Get Seller Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
  }
};

/**
 * @desc    Update Seller Profile
 * @route   PUT /api/seller/profile
 * @access  Private (Seller Only)
 */
export const updateSellerProfile = async (req, res) => {
  try {
    const { name, phone, agencyName, reraNumber, profileImage } = req.body;
    
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.seller.id,
      { 
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone }),
        ...(agencyName && { agencyName: agencyName.trim() }),
        ...(reraNumber && { reraNumber: reraNumber.trim() }),
        ...(profileImage !== undefined && { profileImage })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedSeller) {
      return res.status(404).json({ success: false, message: 'Seller not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      seller: updatedSeller
    });
  } catch (error) {
    console.error('❌ Update Seller Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};
