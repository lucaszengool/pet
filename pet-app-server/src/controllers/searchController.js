const { Op } = require('sequelize');
const { Pet, Service, Product, User } = require('../models');
const { success, paginate } = require('../utils/response');

exports.search = async (req, res, next) => {
  try {
    const { keyword, type, page = 1, pageSize = 20, sort = 'newest', city, min_price, max_price } = req.query;
    if (!keyword) return success(res, { list: [], pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 } });

    const offset = (page - 1) * pageSize;
    const results = [];

    const buildWhere = (searchFields) => {
      const where = {
        status: 'active',
        [Op.or]: searchFields.map(f => ({ [f]: { [Op.like]: `%${keyword}%` } })),
      };
      if (city) where.city = { [Op.like]: `%${city}%` };
      return where;
    };

    if (!type || type === 'pet') {
      const where = buildWhere(['title', 'breed', 'description']);
      if (min_price) where.price = { ...where.price, [Op.gte]: min_price };
      if (max_price) where.price = { ...where.price, [Op.lte]: max_price };

      const pets = await Pet.findAll({
        where,
        include: [{ model: User, as: 'owner', attributes: ['id', 'nickname', 'avatar'] }],
        order: [['created_at', 'DESC']],
        limit: type ? parseInt(pageSize) : 5,
        offset: type ? parseInt(offset) : 0,
      });
      pets.forEach(p => results.push({ ...p.toJSON(), result_type: 'pet' }));
    }

    if (!type || type === 'service') {
      const where = buildWhere(['title', 'service_type', 'description']);
      const services = await Service.findAll({
        where,
        include: [{ model: User, as: 'provider', attributes: ['id', 'nickname', 'avatar', 'shop_name'] }],
        order: [['created_at', 'DESC']],
        limit: type ? parseInt(pageSize) : 5,
        offset: type ? parseInt(offset) : 0,
      });
      services.forEach(s => results.push({ ...s.toJSON(), result_type: 'service' }));
    }

    if (!type || type === 'product') {
      const where = buildWhere(['title', 'description']);
      if (min_price) where.price = { ...where.price, [Op.gte]: min_price };
      if (max_price) where.price = { ...where.price, [Op.lte]: max_price };

      const products = await Product.findAll({
        where,
        include: [{ model: User, as: 'seller', attributes: ['id', 'nickname', 'avatar', 'shop_name'] }],
        order: [['created_at', 'DESC']],
        limit: type ? parseInt(pageSize) : 5,
        offset: type ? parseInt(offset) : 0,
      });
      products.forEach(p => results.push({ ...p.toJSON(), result_type: 'product' }));
    }

    // Sort combined results
    if (sort === 'price_asc') results.sort((a, b) => (a.price || a.price_min || 0) - (b.price || b.price_min || 0));
    else if (sort === 'price_desc') results.sort((a, b) => (b.price || b.price_min || 0) - (a.price || a.price_min || 0));
    else results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return success(res, {
      list: results,
      pagination: { total: results.length, page: parseInt(page), pageSize: parseInt(pageSize) },
    });
  } catch (err) { next(err); }
};

// Hot searches
exports.hotSearches = async (req, res, next) => {
  try {
    // In production, this would be driven by Redis sorted sets
    const hot = [
      { keyword: '上门喂养', count: 1256 },
      { keyword: '金毛幼犬', count: 998 },
      { keyword: '猫咪寄养', count: 876 },
      { keyword: '宠物疫苗', count: 754 },
      { keyword: '遛狗服务', count: 632 },
      { keyword: '狗粮推荐', count: 521 },
      { keyword: '宠物美容', count: 498 },
      { keyword: '布偶猫', count: 432 },
    ];
    return success(res, hot);
  } catch (err) { next(err); }
};
