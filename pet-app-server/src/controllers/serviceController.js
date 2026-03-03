const { Op } = require('sequelize');
const { Service, User, Category, Favorite } = require('../models');
const { success, created, badRequest, notFound, paginate } = require('../utils/response');
const { cache } = require('../config/redis');

exports.create = async (req, res, next) => {
  try {
    const { title, service_type, description, images, price_min, price_max, price_list, contact, business_hours, city, address, latitude, longitude, category_id } = req.body;
    if (!title || !service_type) return badRequest(res, '标题和服务类型不能为空');

    const svc = await Service.create({
      user_id: req.userId, category_id,
      title, service_type, description, images: images || [],
      price_min, price_max, price_list: price_list || [],
      contact: contact || req.user.phone, business_hours,
      city, address, latitude, longitude,
      status: 'active',
    });

    await cache.delPattern('services:*');
    return created(res, svc, '发布成功');
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, category_id, city, service_type, sort = 'newest', keyword, lat, lng } = req.query;
    const offset = (page - 1) * pageSize;

    const where = { status: 'active' };
    if (category_id) where.category_id = category_id;
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (service_type) where.service_type = service_type;
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { service_type: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const order = sort === 'rating' ? [['rating', 'DESC']]
      : sort === 'popular' ? [['order_count', 'DESC']]
      : sort === 'price_asc' ? [['price_min', 'ASC']]
      : [['created_at', 'DESC']];

    const result = await Service.findAndCountAll({
      where,
      include: [{ model: User, as: 'provider', attributes: ['id', 'nickname', 'avatar', 'verified', 'shop_name'] }],
      order, limit: parseInt(pageSize), offset: parseInt(offset),
    });

    // If lat/lng provided, calculate distance (simple approximation)
    if (lat && lng) {
      result.rows = result.rows.map(s => {
        const sObj = s.toJSON();
        if (sObj.latitude && sObj.longitude) {
          const dLat = (sObj.latitude - lat) * 111;
          const dLng = (sObj.longitude - lng) * 111 * Math.cos(lat * Math.PI / 180);
          sObj.distance = Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1) + 'km';
        }
        return sObj;
      });
    }

    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const svc = await Service.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider', attributes: ['id', 'nickname', 'avatar', 'phone', 'verified', 'shop_name', 'shop_address'] },
        { model: Category, as: 'category' },
      ],
    });
    if (!svc) return notFound(res);
    await svc.increment('view_count');

    let isFavorited = false;
    if (req.userId) {
      const fav = await Favorite.findOne({ where: { user_id: req.userId, target_type: 'service', target_id: svc.id } });
      isFavorited = !!fav;
    }
    return success(res, { ...svc.toJSON(), is_favorited: isFavorited });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const svc = await Service.findByPk(req.params.id);
    if (!svc) return notFound(res);
    if (svc.user_id !== req.userId && req.user.role !== 'admin') {
      return require('../utils/response').forbidden(res);
    }
    const allowed = ['title', 'service_type', 'description', 'images', 'price_min', 'price_max', 'price_list', 'contact', 'business_hours', 'city', 'address', 'latitude', 'longitude', 'category_id', 'status'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    await svc.update(updates);
    await cache.delPattern('services:*');
    return success(res, svc, '更新成功');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const svc = await Service.findByPk(req.params.id);
    if (!svc) return notFound(res);
    if (svc.user_id !== req.userId && req.user.role !== 'admin') {
      return require('../utils/response').forbidden(res);
    }
    await svc.destroy();
    return success(res, null, '删除成功');
  } catch (err) { next(err); }
};
