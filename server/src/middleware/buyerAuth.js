import jwt from 'jsonwebtoken';

const buyerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    } else if (req.headers.buyertoken) {
      token = req.headers.buyertoken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided. Access denied.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_real_estate_jwt_key_2026');

    // Confirm role is buyer (or allow admin oversight if applicable)
    if (decoded.role !== 'buyer' && decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You must be a logged-in Buyer to perform this action.'
      });
    }

    req.buyer = decoded;
    next();
  } catch (error) {
    console.error('❌ Buyer Auth Verification Failure:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Buyer token. Please log in again.'
    });
  }
};

export default buyerAuth;
