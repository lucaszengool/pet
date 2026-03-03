const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  target_type: {
    type: DataTypes.ENUM('pet', 'service', 'product'),
    allowNull: false,
  },
  target_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  indexes: [
    { unique: true, fields: ['user_id', 'target_type', 'target_id'] },
    { fields: ['user_id'] },
  ],
});

const BrowseHistory = sequelize.define('BrowseHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  target_type: {
    type: DataTypes.ENUM('pet', 'service', 'product'),
    allowNull: false,
  },
  target_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'browse_histories',
  indexes: [
    { fields: ['user_id', 'created_at'] },
  ],
});

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  spec: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  selected: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'cart_items',
  indexes: [
    { fields: ['user_id'] },
  ],
});

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  city: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  district: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  detail: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'addresses',
  indexes: [
    { fields: ['user_id'] },
  ],
});

module.exports = { Favorite, BrowseHistory, CartItem, Address };
