const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401); throw new Error('Not authorized, no token');
    }
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) { res.status(401); throw new Error('User not found'); }
    next();
  } catch (err) {
    if (res.statusCode < 400) res.status(401);
    next(err);
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error('Forbidden: insufficient role'));
  }
  next();
};