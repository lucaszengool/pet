const { Op } = require('sequelize');
const { Product, User, Category, Favorite } = require('../models');
const { success, created, badRequest, notFound, paginate } = require('../utils/response');
const { cache } = require('../config/redis');

exports.create = async (req, res, next) => {
  try {
    const { title, description, images, price, original_price, specs, stock, shipping_fee, category_id } = req.body;
    if (!title || !price) return badRequest(res, '标题和价格不能为空');

    const product = await Product.create({
      user_id: req.userId, category_id,
      title, description, images: images || [],
      price, original_price: original_price || price,
      specs: specs || [], stock: stock || 0,
      shipping_fee: shipping_fee || 0,
      status: 'active',
    });

    await cache.delPattern('products:*');
    return created(res, product, '发布成功');
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, category_id, sort = 'newest', keyword, min_price, max_price } = req.query;
    const offset = (page - 1) * pageSize;

    const where = { status: 'active' };
    if (category_id) where.category_id = category_id;
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (min_price) where.price = { ...where.price, [Op.gte]: min_price };
    if (max_price) where.price = { ...where.price, [Op.lte]: max_price };

    const order = sort === 'price_asc' ? [['price', 'ASC']]
      : sort === 'price_desc' ? [['price', 'DESC']]
      : sort === 'sales' ? [['sales', 'DESC']]
      : sort === 'popular' ? [['view_count', 'DESC']]
      : [['created_at', 'DESC']];

    const result = await Product.findAndCountAll({
      where,
      include: [{ model: User, as: 'seller', attributes: ['id', 'nickname', 'avatar', 'verified', 'shop_name'] }],
      order, limit: parseInt(pageSize), offset: parseInt(offset),
    });
    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'nickname', 'avatar', 'phone', 'verified', 'shop_name'] },
        { model: Category, as: 'category' },
      ],
    });
    if (!product) return notFound(res);
    await product.increment('view_count');

    let isFavorited = false;
    if (req.userId) {
      const fav = await Favorite.findOne({ where: { user_id: req.userId, target_type: 'product', target_id: product.id } });
      isFavorited = !!fav;
    }
    return success(res, { ...product.toJSON(), is_favorited: isFavorited });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return notFound(res);
    if (product.user_id !== req.userId && req.user.role !== 'admin') return require('../utils/response').forbidden(res);

    const allowed = ['title', 'description', 'images', 'price', 'original_price', 'specs', 'stock', 'shipping_fee', 'category_id', 'status'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    await product.update(updates);
    await cache.delPattern('products:*');
    return success(res, product, '更新成功');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return notFound(res);
    if (product.user_id !== req.userId && req.user.role !== 'admin') return require('../utils/response').forbidden(res);
    await product.destroy();
    return success(res, null, '删除成功');
  } catch (err) { next(err); }
};
