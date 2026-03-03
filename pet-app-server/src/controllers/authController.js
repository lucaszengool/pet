const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { success, badRequest, unauthorized } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { phone, password, nickname } = req.body;
    if (!phone || !password) return badRequest(res, '手机号和密码不能为空');
    if (!/^1[3-9]\d{9}$/.test(phone)) return badRequest(res, '手机号格式不正确');
    if (password.length < 6) return badRequest(res, '密码至少6位');

    const existing = await User.findOne({ where: { phone } });
    if (existing) return badRequest(res, '该手机号已注册');

    const user = await User.create({ phone, password, nickname: nickname || `宠友${phone.slice(-4)}` });
    const token = generateToken({ id: user.id, role: user.role });

    return success(res, { token, user: user.toSafeJSON() }, '注册成功');
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return badRequest(res, '手机号和密码不能为空');

    const user = await User.findOne({ where: { phone } });
    if (!user) return unauthorized(res, '账号不存在');
    if (user.status === 'banned') return unauthorized(res, '账号已被禁用');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return unauthorized(res, '密码错误');

    const token = generateToken({ id: user.id, role: user.role });
    return success(res, { token, user: user.toSafeJSON() });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    return success(res, req.user.toSafeJSON());
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['nickname', 'avatar', 'gender', 'bio', 'city'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    await req.user.update(updates);
    return success(res, req.user.toSafeJSON(), '更新成功');
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return badRequest(res, '请填写完整');
    if (newPassword.length < 6) return badRequest(res, '新密码至少6位');

    const isMatch = await req.user.comparePassword(oldPassword);
    if (!isMatch) return badRequest(res, '原密码错误');

    await req.user.update({ password: newPassword });
    const token = generateToken({ id: req.user.id, role: req.user.role });
    return success(res, { token }, '密码修改成功');
  } catch (err) { next(err); }
};

exports.signIn = async (req, res, next) => {
  try {
    const user = req.user;
    const today = new Date().toISOString().split('T')[0];
    if (user.last_sign_in === today) return badRequest(res, '今日已签到');

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const consecutive = user.last_sign_in === yesterday ? user.sign_in_days + 1 : 1;
    const pointsEarned = Math.min(consecutive * 5, 50); // Max 50 points/day

    await user.update({
      last_sign_in: today,
      sign_in_days: consecutive,
      points: user.points + pointsEarned,
    });

    return success(res, {
      consecutive_days: consecutive,
      points_earned: pointsEarned,
      total_points: user.points + pointsEarned,
    }, '签到成功');
  } catch (err) { next(err); }
};

// Merchant registration
exports.applyMerchant = async (req, res, next) => {
  try {
    const { shop_name, shop_address, shop_phone, business_license, latitude, longitude } = req.body;
    if (!shop_name) return badRequest(res, '请填写店铺名称');

    await req.user.update({
      role: 'merchant',
      shop_name,
      shop_address: shop_address || '',
      shop_phone: shop_phone || '',
      business_license: business_license || '',
      latitude: latitude || 0,
      longitude: longitude || 0,
    });
    return success(res, req.user.toSafeJSON(), '商家申请成功');
  } catch (err) { next(err); }
};
