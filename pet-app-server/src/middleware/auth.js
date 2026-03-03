const { verifyToken } = require('../utils/jwt');
const { unauthorized } = require('../utils/response');
const { User } = require('../models');

// Required authentication
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return unauthorized(res);
    }
    const token = header.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user || user.status !== 'active') {
      return unauthorized(res, '账号已被禁用');
    }
    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return unauthorized(res, 'token已过期，请重新登录');
  }
};

// Optional authentication - sets req.user if token is valid, continues otherwise
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });
      if (user && user.status === 'active') {
        req.user = user;
        req.userId = user.id;
      }
    }
  } catch { /* ignore */ }
  next();
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return require('../utils/response').forbidden(res);
    }
    next();
  };
};

module.exports = { auth, optionalAuth, authorize };
