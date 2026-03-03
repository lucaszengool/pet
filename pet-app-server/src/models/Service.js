const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
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
  service_type: {
    type: DataTypes.STRING(50),
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
  price_min: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  price_max: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  price_list: {
    type: DataTypes.TEXT, // JSON array of {name, desc, price}
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('price_list');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('price_list', JSON.stringify(val));
    },
  },
  contact: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  business_hours: {
    type: DataTypes.STRING(100),
    defaultValue: '09:00 - 18:00',
  },
  city: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    defaultValue: 0,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
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
  order_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'rejected', 'closed'),
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
}, {
  tableName: 'services',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['category_id'] },
    { fields: ['service_type'] },
    { fields: ['status'] },
    { fields: ['city'] },
  ],
});

module.exports = Service;
