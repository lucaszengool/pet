/**
 * Standardized API response helpers
 */
const success = (res, data = null, message = 'success', statusCode = 200) => {
  return res.status(statusCode).json({
    code: 0,
    message,
    data,
    timestamp: Date.now(),
  });
};

const created = (res, data = null, message = '创建成功') => {
  return success(res, data, message, 201);
};

const error = (res, message = '服务器错误', statusCode = 500, code = -1) => {
  return res.status(statusCode).json({
    code,
    message,
    data: null,
    timestamp: Date.now(),
  });
};

const badRequest = (res, message = '请求参数错误') => error(res, message, 400, 400);
const unauthorized = (res, message = '请先登录') => error(res, message, 401, 401);
const forbidden = (res, message = '无权限') => error(res, message, 403, 403);
const notFound = (res, message = '资源不存在') => error(res, message, 404, 404);

const paginate = (res, { rows, count, page, pageSize }) => {
  return success(res, {
    list: rows,
    pagination: {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  });
};

module.exports = { success, created, error, badRequest, unauthorized, forbidden, notFound, paginate };
