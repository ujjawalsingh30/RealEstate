import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import Buyer from '../models/buyerModel.js';
import Seller from '../models/sellerModel.js';
import Property from '../models/propertyModel.js';

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

/**
 * @desc    Get all sellers (for admin dashboard/approvals)
 * @route   GET /api/admin/sellers
 * @access  Private (Admin Only)
 */
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      sellers
    });
  } catch (error) {
    console.error('❌ Get All Sellers Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving sellers.'
    });
  }
};

/**
 * @desc    Update a seller's verification status
 * @route   PUT /api/admin/sellers/:id/status
 * @access  Private (Admin Only)
 */
export const updateSellerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    if (!['pending', 'approved', 'rejected', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be pending, approved, rejected, or blocked.'
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}.`,
      seller
    });

  } catch (error) {
    console.error('❌ Update Seller Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating seller status.'
    });
  }
};

/**
 * @desc    Delete a seller account completely
 * @route   DELETE /api/admin/sellers/:id
 * @access  Private (Admin)
 */
export const deleteSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Seller.findByIdAndDelete(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seller completely removed from the system.'
    });
  } catch (error) {
    console.error('❌ Delete Seller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message.'
    });
  }
};

/**
 * @desc    Change Admin Password
 * @route   PUT /api/admin/change-password
 * @access  Private (Admin Only)
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
    }
    
    const admin = await Admin.findOne({ email: req.admin.email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch && currentPassword !== admin.password) {
      return res.status(401).json({ success: false, message: 'Invalid current password.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();
    
    return res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('❌ Change Admin Password Error:', error);
    return res.status(500).json({ success: false, message: 'Error changing password.' });
  }
};

// ============================================================================
// UNIFIED USER MANAGEMENT (ADMIN / BUYER / SELLER)
// ============================================================================

/**
 * @desc    Get all users across all roles (Admin, Buyer, Seller)
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const [admins, buyers, sellers] = await Promise.all([
      Admin.find({}).select('-password').lean(),
      Buyer.find({}).select('-password').lean(),
      Seller.find({}).select('-password').lean()
    ]);

    const formattedAdmins = admins.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: '',
      role: 'ADMIN',
      status: 'Active', // Admins are always active
      joined: new Date(u.createdAt).toISOString().split('T')[0],
      initials: u.name.charAt(0).toUpperCase(),
      avatarColor: 'bg-emerald-100 text-emerald-800'
    }));

    const formattedBuyers = buyers.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: 'BUYER',
      status: u.status === 'suspended' ? 'Suspended' : 'Active',
      joined: new Date(u.createdAt).toISOString().split('T')[0],
      initials: u.name.charAt(0).toUpperCase(),
      avatarColor: 'bg-blue-100 text-blue-800'
    }));

    const formattedSellers = sellers.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: 'SELLER',
      status: u.status === 'approved' ? 'Active' : 'Suspended',
      joined: new Date(u.createdAt).toISOString().split('T')[0],
      initials: u.name.charAt(0).toUpperCase(),
      avatarColor: 'bg-teal-100 text-teal-800'
    }));

    const allUsers = [...formattedAdmins, ...formattedBuyers, ...formattedSellers].sort((a, b) => new Date(b.joined) - new Date(a.joined));

    res.status(200).json({
      success: true,
      users: allUsers
    });

  } catch (error) {
    console.error('❌ Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving all users.'
    });
  }
};

/**
 * @desc    Update unified user status (suspend or activate)
 * @route   PUT /api/admin/users/:role/:id/status
 * @access  Private (Admin Only)
 */
export const updateUserStatusUnified = async (req, res) => {
  const { role, id } = req.params;
  const { status } = req.body; // Expects 'Active' or 'Suspended'

  if (role.toUpperCase() === 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Cannot modify admin status.' });
  }

  try {
    let updatedUser;
    if (role.toUpperCase() === 'BUYER') {
      const newStatus = status === 'Suspended' ? 'suspended' : 'active';
      updatedUser = await Buyer.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    } else if (role.toUpperCase() === 'SELLER') {
      const newStatus = status === 'Suspended' ? 'blocked' : 'approved';
      updatedUser = await Seller.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`
    });

  } catch (error) {
    console.error('❌ Update Unified User Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating user status.' });
  }
};

/**
 * @desc    Delete unified user
 * @route   DELETE /api/admin/users/:role/:id
 * @access  Private (Admin Only)
 */
export const deleteUnifiedUser = async (req, res) => {
  const { role, id } = req.params;

  if (role.toUpperCase() === 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Cannot delete admin account.' });
  }

  try {
    let deletedUser;
    if (role.toUpperCase() === 'BUYER') {
      deletedUser = await Buyer.findByIdAndDelete(id);
    } else if (role.toUpperCase() === 'SELLER') {
      deletedUser = await Seller.findByIdAndDelete(id);
    }

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User permanently deleted.' });
  } catch (error) {
    console.error('❌ Delete Unified User Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user.' });
  }
};

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getAdminStats = async (req, res) => {
  try {
    const [totalBuyers, totalSellers, totalProperties, pendingSellers, recentSellers] = await Promise.all([
      Buyer.countDocuments(),
      Seller.countDocuments(),
      Property.countDocuments(),
      Seller.countDocuments({ status: 'pending' }),
      Seller.find({ status: 'pending' }).select('name email status createdAt').sort({ createdAt: -1 }).limit(5)
    ]);

    const verifiedSellers = totalSellers - pendingSellers; // Approximation for active vs pending

    res.status(200).json({
      success: true,
      stats: {
        totalBuyers,
        totalSellers,
        verifiedSellers,
        pendingSellers,
        totalProperties
      },
      recentRequests: recentSellers.map(s => ({
        id: `SR-${s._id.toString().slice(-4).toUpperCase()}`,
        seller: s.name,
        type: 'Seller Account Approval',
        date: new Date(s.createdAt).toISOString().split('T')[0],
        status: 'Pending Review',
        rawId: s._id
      }))
    });
  } catch (error) {
    console.error('❌ Get Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin stats.'
    });
  }
};
