const { Review, User, Order, Service, Product } = require('../models');
const { success, created, badRequest, notFound, paginate, forbidden } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const { order_id, target_type, target_id, rating, content, images, is_anonymous } = req.body;
    if (!target_type || !target_id || !rating) return badRequest(res, '评价信息不完整');

    // Check for duplicate review
    if (order_id) {
      const existing = await Review.findOne({ where: { order_id } });
      if (existing) return badRequest(res, '该订单已评价');
    }

    const review = await Review.create({
      user_id: req.userId,
      order_id: order_id || null,
      target_type, target_id,
      rating, content: content || '',
      images: images || [],
      is_anonymous: is_anonymous || false,
    });

    // Update order status
    if (order_id) {
      await Order.update({ status: 'reviewed' }, { where: { id: order_id } });
    }

    // Update target rating
    if (target_type === 'service') {
      const reviews = await Review.findAll({ where: { target_type: 'service', target_id } });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Service.update({ rating: avgRating.toFixed(1), review_count: reviews.length }, { where: { id: target_id } });
    } else if (target_type === 'product') {
      const reviews = await Review.findAll({ where: { target_type: 'product', target_id } });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.update({ rating: avgRating.toFixed(1), review_count: reviews.length }, { where: { id: target_id } });
    }

    return created(res, review, '评价成功');
  } catch (err) { next(err); }
};

exports.listByTarget = async (req, res, next) => {
  try {
    const { target_type, target_id } = req.params;
    const { page = 1, pageSize = 20 } = req.query;

    const result = await Review.findAndCountAll({
      where: { target_type, target_id },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'nickname', 'avatar'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
    });
    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

// Merchant reply
exports.reply = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return notFound(res);

    // Verify the replier is the merchant of the target
    const { reply } = req.body;
    if (!reply) return badRequest(res, '回复内容不能为空');

    await review.update({ reply, reply_at: new Date() });
    return success(res, review, '回复成功');
  } catch (err) { next(err); }
};
