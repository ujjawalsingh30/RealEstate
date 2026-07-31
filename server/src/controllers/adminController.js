import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';

/**
 * @desc    Authenticate Admin & Generate JWT Token (Uses Mongoose AdminModel + Auto-Seed)
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query database for existing Admin account
    let admin = await Admin.findOne({ email: cleanEmail });

    // Auto-seed Initial Admin into MongoDB if Database has no entry yet and credentials match default/env
    if (!admin) {
      const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@realestate.com').toLowerCase().trim();
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (cleanEmail === defaultEmail && password === defaultPassword) {
        console.log("🌱 First-time Admin login: Auto-seeding Admin account into MongoDB Atlas...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        admin = await Admin.create({
          name: 'Super Admin',
          email: defaultEmail,
          password: hashedPassword,
          role: 'superadmin',
          permissions: ['all', 'manage_users', 'approve_sellers', 'manage_properties', 'view_messages'],
          lastLogin: new Date()
        });
        console.log("✅ Super Admin account successfully created in DB!");
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid Admin email or password.'
        });
      }
    } else {
      // Admin exists in database, verify password using bcrypt
      const isMatch = await bcrypt.compare(password, admin.password);

      // Fallback check in case password was previously saved as plaintext
      if (!isMatch && password !== admin.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Admin email or password.'
        });
      }

      // Update lastLogin timestamp in database
      admin.lastLogin = new Date();
      await admin.save();
    }

    // Generate JWT token valid for 7 days
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email, 
        role: admin.role, 
        name: admin.name,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful!',
      token,
      role: admin.role,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin authentication.',
      error: error.message
    });
  }
};

/**
 * @desc    Verify if provided token is valid & return active admin profile from DB
 * @route   GET /api/admin/verify
 * @access  Private (Admin Only)
 */
export const verifyAdminToken = async (req, res) => {
  try {
    // Query database to ensure admin account still exists and fetch latest profile (without password)
    const adminUser = await Admin.findOne({ email: req.admin.email }).select('-password');

    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user no longer exists in database.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin session is active and token is valid.',
      admin: adminUser
    });
  } catch (error) {
    console.error('❌ Verify Admin Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying token.'
    });
  }
};

/**
 * @desc    Logout Admin (Frontend clearing instruction)
 * @route   POST /api/admin/logout
 * @access  Private (Admin Only)
 */
export const adminLogout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Admin logged out successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error during logout.'
    });
  }
};
