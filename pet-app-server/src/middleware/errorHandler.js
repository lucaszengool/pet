const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, '文件大小超过限制', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return error(res, '文件数量超过限制', 400);
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message).join('; ');
    return error(res, messages, 400);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, '数据已存在', 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return error(res, '无效的token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return error(res, 'token已过期', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : '服务器内部错误';
  return error(res, message, statusCode);
};

module.exports = errorHandler;
