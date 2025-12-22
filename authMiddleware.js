const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized to access this route',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(403).json({
          error: 'Your account has been deactivated',
        });
      }

      if (
        user.role === 'college_admin' &&
        user.approval_status !== 'approved'
      ) {
        return res.status(403).json({
          error: 'Your admin account is pending approval',
          approval_status: user.approval_status,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Server error. Please try again later.',
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

/* =========================================
   ✅ EXPORTS (THIS FIXES YOUR ERROR)
   ========================================= */

// Named exports (recommended)
exports.protect = protect;
exports.restrictTo = restrictTo;

// 🔥 ADD THIS: default export for backward compatibility
module.exports = protect;
module.exports.protect = protect;
module.exports.restrictTo = restrictTo;
