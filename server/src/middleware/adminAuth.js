import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    // Check for token in Authorization header (Bearer <token>) or custom token headers
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    } else if (req.headers.admintoken) {
      token = req.headers.admintoken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided. Admin access denied.'
      });
    }

    // Verify JWT token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026');

    // Confirm role is admin or superadmin
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You lack sufficient privileges to perform this admin action.'
      });
    }

    // Attach verified admin details to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('❌ Admin Auth Verification Failure:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Admin token. Please login again.'
    });
  }
};

export default adminAuth;
