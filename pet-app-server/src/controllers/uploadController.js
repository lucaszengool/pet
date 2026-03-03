const { success, badRequest } = require('../utils/response');
const config = require('../config');

exports.uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return badRequest(res, '请选择要上传的图片');
    }

    const urls = req.files.map(file => {
      return `/uploads/${req.params.type || 'images'}/${file.filename}`;
    });

    return success(res, { urls }, '上传成功');
  } catch (err) { next(err); }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return badRequest(res, '请选择头像图片');
    const url = `/uploads/avatars/${req.file.filename}`;

    // Update user avatar
    if (req.user) {
      await req.user.update({ avatar: url });
    }

    return success(res, { url }, '头像上传成功');
  } catch (err) { next(err); }
};
