const { Op } = require('sequelize');
const { Pet, User, Category, Favorite } = require('../models');
const { success, created, badRequest, notFound, paginate } = require('../utils/response');
const { cache } = require('../config/redis');

exports.create = async (req, res, next) => {
  try {
    const { title, breed, age, gender, vaccine, deworming, sterilized, price, price_type, description, images, contact, city, address, latitude, longitude, category_id } = req.body;
    if (!title || !price) return badRequest(res, '标题和价格不能为空');

    const pet = await Pet.create({
      user_id: req.userId,
      category_id,
      title, breed, age, gender, vaccine, deworming, sterilized,
      price, price_type: price_type || 'fixed',
      description, images: images || [],
      contact: contact || req.user.phone,
      city, address, latitude, longitude,
      status: 'active', // auto-approve for now
    });

    await cache.delPattern('pets:*');
    return created(res, pet, '发布成功');
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, category_id, city, breed, sort = 'newest', keyword, min_price, max_price } = req.query;
    const offset = (page - 1) * pageSize;

    const where = { status: 'active' };
    if (category_id) where.category_id = category_id;
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (breed) where.breed = { [Op.like]: `%${breed}%` };
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { breed: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (min_price) where.price = { ...where.price, [Op.gte]: min_price };
    if (max_price) where.price = { ...where.price, [Op.lte]: max_price };

    const order = sort === 'price_asc' ? [['price', 'ASC']]
      : sort === 'price_desc' ? [['price', 'DESC']]
      : sort === 'popular' ? [['view_count', 'DESC']]
      : [['created_at', 'DESC']];

    const result = await Pet.findAndCountAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id', 'nickname', 'avatar', 'verified'] }],
      order,
      limit: parseInt(pageSize),
      offset: parseInt(offset),
    });

    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'nickname', 'avatar', 'phone', 'verified', 'shop_name'] },
        { model: Category, as: 'category' },
      ],
    });
    if (!pet || pet.status === 'rejected') return notFound(res, '宠物信息不存在');

    // Increment view count
    await pet.increment('view_count');

    // Check if favorited by current user
    let isFavorited = false;
    if (req.userId) {
      const fav = await Favorite.findOne({ where: { user_id: req.userId, target_type: 'pet', target_id: pet.id } });
      isFavorited = !!fav;
    }

    return success(res, { ...pet.toJSON(), is_favorited: isFavorited });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return notFound(res);
    if (pet.user_id !== req.userId && req.user.role !== 'admin') {
      return require('../utils/response').forbidden(res);
    }

    const allowed = ['title', 'breed', 'age', 'gender', 'vaccine', 'deworming', 'sterilized', 'price', 'price_type', 'description', 'images', 'contact', 'city', 'address', 'latitude', 'longitude', 'category_id', 'status'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    await pet.update(updates);
    await cache.delPattern('pets:*');
    return success(res, pet, '更新成功');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return notFound(res);
    if (pet.user_id !== req.userId && req.user.role !== 'admin') {
      return require('../utils/response').forbidden(res);
    }
    await pet.destroy();
    await cache.delPattern('pets:*');
    return success(res, null, '删除成功');
  } catch (err) { next(err); }
};

exports.getMyPets = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, status } = req.query;
    const where = { user_id: req.userId };
    if (status) where.status = status;

    const result = await Pet.findAndCountAll({
      where, order: [['created_at', 'DESC']],
      limit: parseInt(pageSize), offset: (page - 1) * pageSize,
    });
    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};
