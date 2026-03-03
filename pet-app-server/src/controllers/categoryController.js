const { Category } = require('../models');
const { success, created, notFound } = require('../utils/response');
const { cache } = require('../config/redis');

exports.list = async (req, res, next) => {
  try {
    const { type } = req.query;
    const cacheKey = `categories:${type || 'all'}`;
    const cached = await cache.get(cacheKey);
    if (cached) return success(res, cached);

    const where = { parent_id: null, is_active: true };
    if (type) where.type = type;

    const categories = await Category.findAll({
      where,
      include: [{
        model: Category,
        as: 'children',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']],
      }],
      order: [['sort_order', 'ASC']],
    });

    await cache.set(cacheKey, categories, 3600);
    return success(res, categories);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, parent_id = 0, icon, type, sort_order = 0 } = req.body;
    const category = await Category.create({ name, parent_id, icon, type, sort_order });
    await cache.delPattern('categories:*');
    return created(res, category);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return notFound(res);
    await cat.update(req.body);
    await cache.delPattern('categories:*');
    return success(res, cat, '更新成功');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return notFound(res);
    await cat.update({ is_active: false });
    await cache.delPattern('categories:*');
    return success(res, null, '已删除');
  } catch (err) { next(err); }
};
