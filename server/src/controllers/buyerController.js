import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Buyer from '../models/buyerModel.js';

/**
 * @desc    Register a new Buyer Account
 * @route   POST /api/buyer/register
 * @access  Public
 */
export const registerBuyer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate
    const existingBuyer = await Buyer.findOne({ email: cleanEmail });
    if (existingBuyer) {
      return res.status(400).json({
        success: false,
        message: 'A Buyer account with this email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create buyer
    const newBuyer = await Buyer.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || '',
      wishlist: [],
      role: 'buyer',
      lastLogin: new Date()
    });

    // Sign JWT
    const token = jwt.sign(
      { id: newBuyer._id, email: newBuyer.email, role: 'buyer' },
      process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Buyer account registered successfully!',
      token,
      role: 'buyer',
      user: {
        id: newBuyer._id,
        name: newBuyer.name,
        email: newBuyer.email,
        phone: newBuyer.phone,
        role: newBuyer.role,
        wishlist: newBuyer.wishlist,
        createdAt: newBuyer.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Buyer Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during buyer registration.',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate Buyer & Generate JWT
 * @route   POST /api/buyer/login
 * @access  Public
 */
export const loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const buyer = await Buyer.findOne({ email: cleanEmail });

    if (!buyer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update lastLogin
    buyer.lastLogin = new Date();
    await buyer.save();

    const token = jwt.sign(
      { id: buyer._id, email: buyer.email, role: 'buyer' },
      process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Buyer login successful!',
      token,
      role: buyer.role,
      user: {
        id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        role: buyer.role,
        wishlist: buyer.wishlist,
        lastLogin: buyer.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Buyer Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
};

/**
 * @desc    Get Current Buyer Profile
 * @route   GET /api/buyer/profile
 * @access  Private (Buyer Only)
 */
export const getBuyerProfile = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.buyer.id).select('-password');
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }
    return res.status(200).json({ success: true, buyer });
  } catch (error) {
    console.error('❌ Get Buyer Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
  }
};

/**
 * @desc    Update Buyer Profile & Wishlist
 * @route   PUT /api/buyer/profile
 * @access  Private (Buyer Only)
 */
export const updateBuyerProfile = async (req, res) => {
  try {
    const { name, fullName, phone, profileImage, wishlist, location, bio } = req.body;
    
    const targetName = name || fullName;

    const updatedBuyer = await Buyer.findByIdAndUpdate(
      req.buyer.id,
      { 
        ...(targetName && { name: targetName.trim() }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location: location.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(profileImage !== undefined && { profileImage }),
        ...(wishlist && { wishlist })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedBuyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      buyer: updatedBuyer
    });
  } catch (error) {
    console.error('❌ Update Buyer Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};
