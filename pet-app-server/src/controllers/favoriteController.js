const { Favorite, BrowseHistory, CartItem, Address, Pet, Service, Product, User } = require('../models');
const { success, created, badRequest, notFound, paginate } = require('../utils/response');

// ========== Favorites ==========
exports.toggle = async (req, res, next) => {
  try {
    const { target_type, target_id } = req.body;
    if (!target_type || !target_id) return badRequest(res, '参数不完整');

    const existing = await Favorite.findOne({
      where: { user_id: req.userId, target_type, target_id },
    });

    if (existing) {
      await existing.destroy();
      // Decrement count
      const Model = target_type === 'pet' ? Pet : target_type === 'service' ? Service : Product;
      await Model.decrement('favorite_count', { where: { id: target_id } });
      return success(res, { favorited: false }, '取消收藏');
    } else {
      await Favorite.create({ user_id: req.userId, target_type, target_id });
      const Model = target_type === 'pet' ? Pet : target_type === 'service' ? Service : Product;
      await Model.increment('favorite_count', { where: { id: target_id } });
      return success(res, { favorited: true }, '已收藏');
    }
  } catch (err) { next(err); }
};

exports.listFavorites = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, target_type } = req.query;
    const where = { user_id: req.userId };
    if (target_type) where.target_type = target_type;

    const result = await Favorite.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
    });

    // Enrich with target details
    const enriched = await Promise.all(result.rows.map(async fav => {
      const f = fav.toJSON();
      const Model = f.target_type === 'pet' ? Pet : f.target_type === 'service' ? Service : Product;
      f.target = await Model.findByPk(f.target_id, { attributes: ['id', 'title', 'images', 'price', 'price_min'] });
      return f;
    }));

    return paginate(res, { rows: enriched, count: result.count, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

// ========== Browse History ==========
exports.addHistory = async (req, res, next) => {
  try {
    const { target_type, target_id } = req.body;
    await BrowseHistory.create({ user_id: req.userId, target_type, target_id });
    return success(res);
  } catch (err) { next(err); }
};

exports.listHistory = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const result = await BrowseHistory.findAndCountAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
    });

    const enriched = await Promise.all(result.rows.map(async h => {
      const hObj = h.toJSON();
      const Model = hObj.target_type === 'pet' ? Pet : hObj.target_type === 'service' ? Service : Product;
      hObj.target = await Model.findByPk(hObj.target_id, { attributes: ['id', 'title', 'images', 'price', 'price_min'] });
      return hObj;
    }));

    return paginate(res, { rows: enriched, count: result.count, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

exports.clearHistory = async (req, res, next) => {
  try {
    await BrowseHistory.destroy({ where: { user_id: req.userId }, force: true });
    return success(res, null, '浏览记录已清空');
  } catch (err) { next(err); }
};

// ========== Cart ==========
exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, spec, quantity = 1 } = req.body;
    if (!product_id) return badRequest(res, '商品ID不能为空');

    const product = await Product.findByPk(product_id);
    if (!product) return notFound(res, '商品不存在');

    const existing = await CartItem.findOne({
      where: { user_id: req.userId, product_id, spec: spec || '' },
    });
    if (existing) {
      await existing.update({ quantity: existing.quantity + quantity });
      return success(res, existing, '已更新数量');
    }
    const item = await CartItem.create({ user_id: req.userId, product_id, spec: spec || '', quantity });
    return created(res, item, '已加入购物车');
  } catch (err) { next(err); }
};

exports.getCart = async (req, res, next) => {
  try {
    const items = await CartItem.findAll({
      where: { user_id: req.userId },
      include: [{ model: Product, as: 'product', attributes: ['id', 'title', 'images', 'price', 'original_price', 'stock', 'status'] }],
      order: [['created_at', 'DESC']],
    });
    return success(res, items);
  } catch (err) { next(err); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item || item.user_id !== req.userId) return notFound(res);
    const { quantity, selected } = req.body;
    if (quantity !== undefined) item.quantity = quantity;
    if (selected !== undefined) item.selected = selected;
    await item.save();
    return success(res, item);
  } catch (err) { next(err); }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item || item.user_id !== req.userId) return notFound(res);
    await item.destroy({ force: true });
    return success(res, null, '已移除');
  } catch (err) { next(err); }
};

// ========== Address ==========
exports.createAddress = async (req, res, next) => {
  try {
    const { name, phone, province, city, district, detail, is_default } = req.body;
    if (!name || !phone || !detail) return badRequest(res, '请填写完整地址信息');

    if (is_default) {
      await Address.update({ is_default: false }, { where: { user_id: req.userId } });
    }
    const address = await Address.create({ user_id: req.userId, name, phone, province, city, district, detail, is_default: is_default || false });
    return created(res, address);
  } catch (err) { next(err); }
};

exports.listAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.userId },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']],
    });
    return success(res, addresses);
  } catch (err) { next(err); }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const addr = await Address.findByPk(req.params.id);
    if (!addr || addr.user_id !== req.userId) return notFound(res);
    if (req.body.is_default) {
      await Address.update({ is_default: false }, { where: { user_id: req.userId } });
    }
    await addr.update(req.body);
    return success(res, addr, '更新成功');
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const addr = await Address.findByPk(req.params.id);
    if (!addr || addr.user_id !== req.userId) return notFound(res);
    await addr.destroy({ force: true });
    return success(res, null, '已删除');
  } catch (err) { next(err); }
};
