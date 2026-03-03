const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('images');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val));
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  specs: {
    type: DataTypes.TEXT, // JSON array of specs
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('specs');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('specs', JSON.stringify(val));
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  shipping_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'rejected', 'soldout', 'closed'),
    defaultValue: 'pending',
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  favorite_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 5.0,
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'products',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['category_id'] },
    { fields: ['status'] },
  ],
});

module.exports = Product;
