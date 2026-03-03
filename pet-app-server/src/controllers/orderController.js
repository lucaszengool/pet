const { Op } = require('sequelize');
const { Order, User, Pet, Service, Product, Review } = require('../models');
const { success, created, badRequest, notFound, paginate, forbidden } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

const generateOrderNo = () => {
  const now = new Date();
  const date = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  return `ORD${date}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

exports.create = async (req, res, next) => {
  try {
    const { order_type, item_id, quantity = 1, spec, booking_date, booking_time, receiver_name, receiver_phone, receiver_address, remark } = req.body;
    if (!order_type || !item_id) return badRequest(res, '订单信息不完整');

    let item, merchant_id, item_title, item_image, unit_price, shipping_fee = 0;

    if (order_type === 'pet') {
      item = await Pet.findByPk(item_id);
      if (!item || item.status !== 'active') return badRequest(res, '宠物信息不存在或已下架');
      merchant_id = item.user_id;
      item_title = item.title;
      item_image = item.images[0] || '';
      unit_price = item.price;
    } else if (order_type === 'service') {
      item = await Service.findByPk(item_id);
      if (!item || item.status !== 'active') return badRequest(res, '服务不存在或已下架');
      merchant_id = item.user_id;
      item_title = item.title;
      item_image = item.images[0] || '';
      unit_price = item.price_min;
      // If spec provided, find matching price from price_list
      if (spec && item.price_list.length > 0) {
        const matched = item.price_list.find(p => p.name === spec);
        if (matched) unit_price = matched.price;
      }
    } else if (order_type === 'product') {
      item = await Product.findByPk(item_id);
      if (!item || item.status !== 'active') return badRequest(res, '商品不存在或已下架');
      if (item.stock < quantity) return badRequest(res, '库存不足');
      merchant_id = item.user_id;
      item_title = item.title;
      item_image = item.images[0] || '';
      unit_price = item.price;
      shipping_fee = item.shipping_fee || 0;
    } else {
      return badRequest(res, '无效的订单类型');
    }

    if (merchant_id === req.userId) return badRequest(res, '不能购买自己的商品/服务');

    const total_price = unit_price * quantity;
    const pay_amount = total_price + shipping_fee;

    const order = await Order.create({
      order_no: generateOrderNo(),
      user_id: req.userId,
      merchant_id,
      order_type,
      item_type: order_type,
      item_id,
      item_title,
      item_image,
      item_spec: spec || '',
      quantity,
      unit_price,
      total_price,
      shipping_fee,
      pay_amount,
      booking_date,
      booking_time,
      receiver_name: receiver_name || '',
      receiver_phone: receiver_phone || '',
      receiver_address: receiver_address || '',
      remark: remark || '',
    });

    // Deduct stock for products
    if (order_type === 'product') {
      await item.decrement('stock', { by: quantity });
      await item.increment('sales', { by: quantity });
    }

    return created(res, order, '订单创建成功');
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, status, role = 'buyer' } = req.query;
    const where = {};
    if (role === 'merchant') {
      where.merchant_id = req.userId;
    } else {
      where.user_id = req.userId;
    }
    if (status && status !== 'all') where.status = status;

    const result = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'nickname', 'avatar'] },
        { model: User, as: 'merchant', attributes: ['id', 'nickname', 'avatar', 'shop_name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
    });
    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'nickname', 'avatar', 'phone'] },
        { model: User, as: 'merchant', attributes: ['id', 'nickname', 'avatar', 'phone', 'shop_name'] },
        { model: Review },
      ],
    });
    if (!order) return notFound(res);
    if (order.user_id !== req.userId && order.merchant_id !== req.userId && req.user.role !== 'admin') {
      return forbidden(res);
    }
    return success(res, order);
  } catch (err) { next(err); }
};

// Pay order
exports.pay = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return notFound(res);
    if (order.user_id !== req.userId) return forbidden(res);
    if (order.status !== 'pending') return badRequest(res, '订单状态不正确');

    const { payment_method = 'wechat' } = req.body;
    await order.update({
      status: 'paid',
      payment_method,
      payment_time: new Date(),
    });

    return success(res, order, '支付成功');
  } catch (err) { next(err); }
};

// Merchant accept order
exports.accept = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return notFound(res);
    if (order.merchant_id !== req.userId) return forbidden(res);
    if (order.status !== 'paid') return badRequest(res, '订单状态不正确');

    await order.update({ status: 'accepted', merchant_remark: req.body.remark || '' });
    return success(res, order, '已接单');
  } catch (err) { next(err); }
};

// Start serving
exports.startServing = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return notFound(res);
    if (order.merchant_id !== req.userId) return forbidden(res);
    if (!['paid', 'accepted'].includes(order.status)) return badRequest(res, '订单状态不正确');

    await order.update({ status: 'serving', tracking_no: req.body.tracking_no || '' });
    return success(res, order, '已开始服务');
  } catch (err) { next(err); }
};

// Complete order
exports.complete = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return notFound(res);
    if (order.user_id !== req.userId && order.merchant_id !== req.userId) return forbidden(res);
    if (order.status !== 'serving') return badRequest(res, '订单状态不正确');

    await order.update({ status: 'completed', completed_at: new Date() });

    // Increment service order count
    if (order.order_type === 'service') {
      await Service.increment('order_count', { where: { id: order.item_id } });
    }

    return success(res, order, '订单已完成');
  } catch (err) { next(err); }
};

// Cancel order
exports.cancel = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return notFound(res);
    if (order.user_id !== req.userId && req.user.role !== 'admin') return forbidden(res);
    if (!['pending', 'paid'].includes(order.status)) return badRequest(res, '当前状态不可取消');

    await order.update({ status: 'cancelled', cancel_reason: req.body.reason || '用户取消' });

    // Restore stock for products
    if (order.order_type === 'product') {
      await Product.increment('stock', { by: order.quantity, where: { id: order.item_id } });
    }

    return success(res, order, '订单已取消');
  } catch (err) { next(err); }
};

// Request refund
exports.refund = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return notFound(res);
    if (order.user_id !== req.userId) return forbidden(res);
    if (!['paid', 'accepted', 'serving'].includes(order.status)) return badRequest(res, '当前状态不可退款');

    await order.update({ status: 'refunding', cancel_reason: req.body.reason || '申请退款' });
    return success(res, order, '退款申请已提交');
  } catch (err) { next(err); }
};
